export function normalizeApiArrayResponse(data) {
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export function normalizeApiObjectResponse(data) {
  if (data && typeof data === 'object' && !Array.isArray(data)) return data;
  return {};
}
