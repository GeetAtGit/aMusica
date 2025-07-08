export async function handler(event) {
  const { url } = event.queryStringParameters;

  if (!url || !url.startsWith("https://api.deezer.com")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid or missing URL" }),
    };
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    const res = await fetch(decodedUrl);
    const data = await res.text();
    return {
      statusCode: 200,
      body: data,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Fetch failed", details: err.message }),
    };
  }
}
