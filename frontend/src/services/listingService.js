const API_BASE_URL = 'http://localhost:8080/apartments';

export const fetchListings = async () => {
  const response = await fetch(API_BASE_URL);
  if(response.ok) alert(response.message);
  return response.json();
};

export const addListing = async (listing) => {
  const token = localStorage.getItem('token');

  await fetch(`${API_BASE_URL}/create-apartment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(listing)
  });

};
