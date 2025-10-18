export async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('API Request:', url, options);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  const contentType = response.headers.get('content-type');

  // Check if we're getting HTML instead of JSON
  if (contentType && contentType.includes('text/html')) {
    console.error('Received HTML instead of JSON from:', url);
    throw new Error('Server routing error. Please try again.');
  }

  let responseData;
  try {
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
        console.error('Received HTML instead of JSON. Server routing issue.');
        throw new Error('Server routing error. Please refresh and try again.');
      }
      responseData = text;
    }
  } catch (parseError) {
    console.error('Failed to parse response:', parseError);
    throw parseError;
  }

  console.log('Response data:', responseData);

  if (!response.ok) {
    if (typeof responseData === 'object' && responseData.error) {
      throw new Error(responseData.error);
    } else if (typeof responseData === 'string') {
      console.error('Non-JSON response:', responseData);
      throw new Error('Server returned an error. Please try again.');
    } else {
      throw new Error('Request failed');
    }
  }

  return responseData;
}