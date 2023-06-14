export default async function RunBacktest(url, data) {
    const bodyData = JSON.stringify(data);
    console.log("Body data:", bodyData);

    const response = await fetch("http://" + url + "/backtesters/run", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyData,
    });


    return response;
}
