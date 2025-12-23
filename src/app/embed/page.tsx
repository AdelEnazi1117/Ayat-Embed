import { notFound } from "next/navigation";

export default function EmbedPage() {
  // Redirect to not-found when accessing /embed without surah/ayah params
  notFound();
}
