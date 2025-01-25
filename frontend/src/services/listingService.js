const API_BASE_URL = 'http://localhost:8080/api/listings';

export const fetchListings = async () => {
  const response = await fetch(API_BASE_URL);
  return response.json();
};

export const addListing = async (listing) => {
  await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing),
  });
};
