export default async function GetAssetsNumber(url, token) {
  const response = await fetch("http://" + url + "/assets/totalnumber", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
