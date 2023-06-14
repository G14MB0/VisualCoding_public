export default async function AddStrategy(url, token, data) {
  const response = await fetch("http://" + url + "/strategies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });


  // Wrap localStorage.removeItem in a Promise
  await new Promise((resolve) => {
    localStorage.removeItem('strategyData');
    resolve();
  });

  return response;
}
