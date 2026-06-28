// Uploads an image File to imgbb and returns the hosted URL.
// Uses native fetch (NOT the axios instance) so it doesn't hit our backend
// base URL or attach the app JWT.
export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("Image upload is not configured");
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data?.data?.url) {
    throw new Error(data?.error?.message || "Image upload failed");
  }
  return data.data.url;
}
