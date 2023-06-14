export default async function GetOptimizationParameters(url) {
    const response = await fetch("http://" + url + "/strategies/ops", {
        method: "GET",
        headers: {
            
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}
