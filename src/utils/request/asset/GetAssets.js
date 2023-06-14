// export default async function GetAssets(url, token) {
//   const response = await fetch("http://" + url + "/assets", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return response.json();
// }


export default async function GetAssets(url, token) {
  const localStorageKey = 'assetsData';

  // Check if data is in localStorage
  let data = localStorage.getItem(localStorageKey);
  if (data != null) {
    // If data exists in localStorage, parse and return it
    console.log("data got from localstorage")
    return JSON.parse(data);
  } else {
    // If data is not in localStorage, fetch it from the API
    const response = await fetch("http://" + url + "/assets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Save the response data to the variable
    data = await response.json();

    // Save the response data to localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(data));
    console.log("data got from API")

    // Return the fetched data
    return data;
  }
}
