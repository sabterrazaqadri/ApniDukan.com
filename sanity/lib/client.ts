import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '1ha5p240',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-01-01', // Adjust based on your API version
  token: process.env.SANITY_API_TOKEN, // Use the token securely
  useCdn: false, // Disable CDN for write operations
});

export default client;
