export default async function GetContent(url, token, name) {
    const response = await fetch("http://" + url + "/dinamic_content/" + name, {
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
