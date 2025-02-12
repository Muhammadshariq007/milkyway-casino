// client.js (for use in the browser or Node.js)
const socket = new WebSocket(import.meta.env.VITE_BASE_WS_URL);

socket.onopen = () => {
    console.log('Connected to the server');
    // Send a message to the server (optional)
    socket.send(JSON.stringify({ message: 'Connected to the server!' }));
};
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    localStorage.setItem("spinner", data.spinNumber);
};

socket.onclose = () => {
    console.log('Disconnected from the server');
};

export default socket