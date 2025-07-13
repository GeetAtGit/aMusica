// netlify/functions/deezer-proxy.js

const DEEZER_API_BASE_URL = 'https://api.deezer.com';

export async function handler(event) {
  const { deezerPath } = event.queryStringParameters;

  if (!deezerPath) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Required 'deezerPath' parameter is missing." }),
    };
  }

  const queryParams = new URLSearchParams(event.queryStringParameters);
  queryParams.delete('deezerPath');

  const deezerUrl = `${DEEZER_API_BASE_URL}/${deezerPath}?${queryParams.toString()}`;

  try {
    const response = await fetch(deezerUrl);

    // ✅ ADDED CHECK: Verify if the request to Deezer was successful.
    if (!response.ok) {
      // Log the error from Deezer's API for debugging in the terminal.
      const errorText = await response.text();
      console.error(`Deezer API Error: ${response.status} - ${errorText}`);

      // Return a specific error message to the front-end.
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Deezer API responded with status ${response.status}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (err) {
    // ✅ IMPROVED LOGGING: Log the actual error message in the terminal.
    console.error("Proxy Function Crash:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message }),
    };
  }
}
