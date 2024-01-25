// This is a basic example of fetching an fetchApi.

export default async function fetchApi(method, url, port, path, body = null) {
  const fullUrl = `http://${url}:${port}/${path}`;

  const headers = {
    "Content-Type": "application/json",
  };

  const config = {
    method: method,
    headers: headers,
  };

  if (body && (method === "POST" || method === "PUT")) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(fullUrl, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the API:", error);
  }
}

