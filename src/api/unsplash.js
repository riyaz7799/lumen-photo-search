const API = "https://api.unsplash.com";
const KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function authHeaders() {
  if (!KEY) throw new Error("Missing VITE_UNSPLASH_ACCESS_KEY. Add it to your .env file.");
  return { Authorization: `Client-ID ${KEY}` };
}

function failure(res) {
  if (res.status === 403 || res.status === 429) {
    return new Error("Unsplash request limit reached. Please try again in a while.");
  }
  return new Error(`Failed to load photos (status ${res.status}). Please try again.`);
}

export async function searchPhotos({ query, page = 1, perPage = 24, orientation, orderBy, signal }) {
  const params = new URLSearchParams({ query, page: String(page), per_page: String(perPage) });
  if (orientation) params.set("orientation", orientation);
  if (orderBy && orderBy !== "relevant") params.set("order_by", orderBy);
  const res = await fetch(`${API}/search/photos?${params}`, { headers: authHeaders(), signal });
  if (!res.ok) throw failure(res);
  return res.json();
}

// Required by Unsplash guidelines: trigger the download endpoint, then use the returned URL.
export async function getDownloadUrl(photo) {
  const res = await fetch(photo.links.download_location, { headers: authHeaders() });
  if (!res.ok) throw failure(res);
  return (await res.json()).url;
}
