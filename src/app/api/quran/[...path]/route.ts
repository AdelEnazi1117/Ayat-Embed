import { NextRequest, NextResponse } from "next/server";

type QfEnv = "prelive" | "production";

// Allowed API path prefixes - security whitelist to prevent arbitrary upstream access
const ALLOWED_PATH_PREFIXES = [
  "chapters",           // Surah list
  "verses/by_key/",     // Single verse by key (e.g., verses/by_key/1:1)
  "verses/by_chapter/", // Verses by chapter
];

/**
 * Validates that the requested path is in the allowed whitelist.
 * This prevents the proxy from being used to access arbitrary upstream endpoints.
 */
function isPathAllowed(pathString: string): boolean {
  return ALLOWED_PATH_PREFIXES.some(
    (prefix) => pathString === prefix || pathString.startsWith(prefix)
  );
}

function getQfConfig() {
  const defaultEnv: QfEnv =
    process.env.NODE_ENV === "production" ? "production" : "prelive";
  const rawEnv = (process.env.QF_ENV || defaultEnv).toLowerCase();
  const env: QfEnv = rawEnv === "production" ? "production" : "prelive";

  const apiBase =
    process.env.QF_API_BASE_URL ||
    (env === "production"
      ? "https://apis.quran.foundation/content/api/v4"
      : "https://apis-prelive.quran.foundation/content/api/v4");

  const tokenUrl =
    process.env.QF_OAUTH_TOKEN_URL ||
    (env === "production"
      ? "https://oauth2.quran.foundation/oauth2/token"
      : "https://prelive-oauth2.quran.foundation/oauth2/token");

  // Credentials MUST be set via environment variables - no fallbacks
  const clientId = process.env.QF_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET;

  return { env, apiBase, tokenUrl, clientId, clientSecret };
}

// Token cache (in-memory for server instance)
let cachedToken: {
  accessToken: string;
  tokenExpiry: number;
  tokenUrl: string;
  clientId: string;
} | null = null;

async function getAccessToken(config: {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
}): Promise<string> {
  if (
    cachedToken &&
    cachedToken.clientId === config.clientId &&
    cachedToken.tokenUrl === config.tokenUrl &&
    Date.now() < cachedToken.tokenExpiry
  ) {
    return cachedToken.accessToken;
  }

  try {
    const auth = Buffer.from(
      `${config.clientId}:${config.clientSecret}`
    ).toString("base64");
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "content",
    });

    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new Error(
        `Auth Error: ${response.status}${details ? ` - ${details}` : ""}`
      );
    }

    const data = await response.json();
    if (!data.access_token) {
      throw new Error("No access token in response");
    }

    const expiresInSeconds =
      typeof data.expires_in === "number" && data.expires_in > 0
        ? data.expires_in
        : 3600;

    cachedToken = {
      accessToken: data.access_token,
      tokenUrl: config.tokenUrl,
      clientId: config.clientId,
      // Set expiry time (subtract 60 seconds as buffer)
      tokenExpiry: Date.now() + Math.max(0, expiresInSeconds - 60) * 1000,
    };

    return cachedToken.accessToken;
  } catch (error) {
    console.error("Failed to get access token:", error);
    throw error;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");

  // Security: Validate path against whitelist
  if (!isPathAllowed(pathString)) {
    return NextResponse.json(
      { error: "Forbidden: This API path is not allowed" },
      { status: 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams.toString();
  const fullPath = searchParams ? `${pathString}?${searchParams}` : pathString;

  try {
    const config = getQfConfig();
    if (!config.clientId || !config.clientSecret) {
      return NextResponse.json(
        {
          error:
            "Quran.Foundation credentials are not configured. Set QF_CLIENT_ID and QF_CLIENT_SECRET on the server.",
        },
        { status: 500 }
      );
    }

    const token = await getAccessToken({
      tokenUrl: config.tokenUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });

    const url = `${config.apiBase}/${fullPath}`;

    // Enable caching: Quran data is stable, cache for 24 hours (increased from 1 hour)
    const response = await fetch(url, {
      headers: {
        "x-auth-token": token,
        "x-client-id": config.clientId,
        Accept: "application/json",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream API Error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Add aggressive cache headers - Quran data is immutable
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
