# API Documentation

The project uses an internal proxy to communicate with the Quran.Foundation API securely.

## Internal Proxy Endpoints
Base path: `/api/quran/`

### Whitelisted Endpoints
-   `/api/quran/chapters`: Fetches the list of all Surahs.
-   `/api/quran/verses/by_key/{verse_key}`: Fetches a specific verse.
-   `/api/quran/verses/by_chapter/{chapter_id}`: Fetches verses for a specific chapter.

## Authentication
The proxy handles authentication automatically. External users cannot access these endpoints directly without going through the application.

## Caching
-   **TTL**: 3600 seconds (1 hour).
-   **Mechanism**: Uses Next.js `fetch` with `next: { revalidate: 3600 }`.
-   **Headers**: Returns `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.

## Embed Communication Contract
Embeds communicate with their parent windows via `postMessage`.

### Height Update
```json
{
  "type": "qveg:height",
  "id": "unique-embed-id",
  "height": 450
}
```
The parent window script listens for this message to adjust the iFrame height dynamically.
