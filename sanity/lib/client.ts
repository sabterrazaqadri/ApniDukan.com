import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId, token } from '../env';

const client = createClient({
  projectId,
  dataset,
  apiVersion, 
  token,
  useCdn: false, // Disable CDN for write operations
});

export default client;
