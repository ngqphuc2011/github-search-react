export async function get(url: URL) {
  return fetch(url, {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_TOKEN || '',
    },
  });
}
