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
  "skGEhfqqbgd1SHRPGYK2hGjVUdI6wGtqP5OPBwQGAhypPOlhDy5TB7u7KjVCgRwXAcZM70BhIg14UYeJ6wtz2UnPZ3pqJ9nY7GDZjstdM34agG0PTNZPUTyykRoJNtLzb7VUdvJWlu5tp4Cq9lLLaGPWLTr7x9MXkJZ43H6TqCJ1CR2xBMfr",
  'Missing environment variable: NEXT_PUBLIC_SANITY_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
