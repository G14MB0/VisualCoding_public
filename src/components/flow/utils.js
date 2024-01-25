export function openWs(localServerUrl, localServerPort, setWs, setMessage) {
    // Initialize the WebSocket connection

    const webSocket = new WebSocket(
        `ws://${localServerUrl}:${localServerPort}/nodes/ws/info/start`
    ); // Replace with your WebSocket URL
    webSocket.onopen = () => {
        console.log("WebSocket Connected");
    };
    webSocket.onmessage = (event) => {
        // Assuming the message is JSON
        try {
            const newMessage = JSON.parse(event.data);
            console.log(newMessage)
            setMessage(newMessage)
        } catch (e) {
            console.error("Error parsing message", e);
        }
    };
    webSocket.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };
    webSocket.onclose = () => {
        console.log("WebSocket Disconnected");
    };
    // Set the WebSocket in state
    setWs(webSocket);

    // Clean up on unmount
    return () => {
        webSocket.close();
    };
}

export function closeWs(ws, setWs) {
    if (ws) {
        ws.close();
        setWs(null)
    }
}