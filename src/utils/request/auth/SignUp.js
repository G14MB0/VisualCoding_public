export default async function SignUp(url, data = {}) {
  console.log(url + "/users");
  const response = await fetch("http://" + url + "/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
