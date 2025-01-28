export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-19'

export const dataset = assertValue(
  "production",
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  "1ha5p240",
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skbz4qROR49IPEJSISb9nhBWep2epOx9kSCoTBPledrfCG9cd1xSwMcllKlxV5uESfsQNz1I7QRAZATVaBVnNzdWveER73RiMdieMt8eZ4z2hLu7LQH6Cy1guRwqUdeL7SvEEfvDDCr2ZoaHSLVEORkMAU8UdeY3RPJzy2UU1kDTe14SmlAH",
  'Missing environment variable: NEXT_PUBLIC_SANITY_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
