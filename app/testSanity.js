const sanityUrl = `https://1ha5p240.api.sanity.io/v2023-01-25/data/mutate/production`; // Replace with your project ID and dataset
const token = "skGEhfqqbgd1SHRPGYK2hGjVUdI6wGtqP5OPBwQGAhypPOlhDy5TB7u7KjVCgRwXAcZM70BhIg14UYeJ6wtz2UnPZ3pqJ9nY7GDZjstdM34agG0PTNZPUTyykRoJNtLzb7VUdvJWlu5tp4Cq9lLLaGPWLTr7x9MXkJZ43H6TqCJ1CR2xBMfr"; // Replace with your actual token

async function testCreatePermission() {
  try {
    const response = await fetch(sanityUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass the token here
      },
      body: JSON.stringify({
        mutations: [
          {
            create: {
              _type: "test", // Replace with your schema's document type
              title: "Permission Test Document", // Example field
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      return;
    }

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

testCreatePermission();
