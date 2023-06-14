export default async function GetStrategyNumber(url, token) {
  const response = await fetch("http://" + url + "/strategies/totalnumber", {
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
