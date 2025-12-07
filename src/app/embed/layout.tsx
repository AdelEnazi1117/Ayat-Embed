import "../globals.css";

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className="m-0 p-0"
        style={{ background: "transparent" }}
      >
        {children}
      </body>
    </html>
  );
}
