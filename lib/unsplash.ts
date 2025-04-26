// lib/unsplash.ts

const UNSPLASH_ACCESS_KEY = "yD6Ny0VdCChOW8i_mu-qtf_h1qQVWtt1jvD2ZTxvJi0"; // Your Access Key

export async function searchImage(query: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.small; // Return small image URL
    }

    return null;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
}
