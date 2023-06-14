export default async function DeleteStrategy(url, token, id) {
    const response = await fetch("http://" + url + "/strategies/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify(data),
    });

    // Wrap localStorage.removeItem in a Promise
    await new Promise((resolve) => {
        localStorage.removeItem('strategyData');
        resolve();
    });

    return response;
}
