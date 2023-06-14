export default async function EditAsset(url, token, data) {
    const response = await fetch("http://" + url + "/assets/", {
        method: "PUT",
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
