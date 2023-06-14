export default async function AddAssets(url, token, data) {
  const response = await fetch("http://" + url + "/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  // Wrap localStorage.removeItem in a Promise
  await new Promise((resolve) => {
    localStorage.removeItem('assetsData');
    resolve();
  });

  return response;
}
