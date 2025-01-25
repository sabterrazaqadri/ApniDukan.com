import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, token } from '../env'

export const client = createClient({
  projectId: "1ha5p240",
  dataset: "production",
  apiVersion: '2021-03-25',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});
