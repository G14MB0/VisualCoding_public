export default async function LogIn(url, data = {}) {

  const response = await fetch("http://" + url + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response

}