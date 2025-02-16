export const apiVersion =
  process.env.SANITY_API_VERSION || '2025-01-19'

export const dataset = assertValue(
  process.env.SANITY_DATASET || "production",
  'Missing environment variable: SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.SANITY_PROJECT_ID || "8ry87cok",
  'Missing environment variable: SANITY_PROJECT_ID'
)

export const token = assertValue(
  process.env.SANITY_API_TOKEN || "skZ8H5dog2fJWd77Gvt4BL9EkTNr83osro4ixAqGLjtcY9POPksDHGj50l1kHx6LS2BPeP565GSdmrPswD6fDHIk465Ufo5OQuPKCzQcorsVhDYjk7KW980gpg8wGZgW9sMDBffaZvNNhbSyBQNvoEtYH0WInnL3RoGSMElwK0rcZBKfhNKv",
  'Missing environment variable: SANITY_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
