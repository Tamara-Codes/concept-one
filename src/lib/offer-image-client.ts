export function offerImageUrl(key: string) {
  return `/api/offers/image?key=${encodeURIComponent(key)}`;
}

export async function uploadOfferImage(blob: Blob, contentType = blob.type) {
  if (blob.size > 4 * 1024 * 1024) throw new Error("Slika je prevelika (najviše 4 MB).");
  const response = await fetch("/api/offers/image", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: blob,
  });
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    throw new Error(details.error || "Slika se nije mogla spremiti.");
  }
  const { key }: { key: string } = await response.json();
  return key;
}
