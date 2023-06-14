export default async function DeleteAsset(url, token, id) {
    const response = await fetch("http://" + url + "/assets/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify(data),
    });

    // Wrap localStorage.removeItem in a Promise
    await new Promise((resolve) => {
        localStorage.removeItem('assetsData');
        resolve();
    });

    return response;
}