// websocket/ws.js
const WebSocket = require('ws');

class WebSocketServerSingleton {
    constructor(server) {
        if (!WebSocketServerSingleton.instance) {
            // Initialize WebSocket server
            this.wss = new WebSocket.Server({ server });
            this.currentWs = null;

            // Handle connections
            this.wss.on('connection', (ws) => {
                this.currentWs = ws;
                console.log('Client connected');
                this.handleConnection(ws);
            });

            // Store the instance
            WebSocketServerSingleton.instance = this;
        }

        return WebSocketServerSingleton.instance;
    }

    // Handle connection logic
    handleConnection(ws) {
        ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));
        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });
        ws.on('close', () => {
            console.log('Client disconnected');
            this.currentWs = null;
        });
    }

    // Public method to broadcast messages to all connected clients
    static sendMessage(message) {
        if (WebSocketServerSingleton.instance?.wss) {
            WebSocketServerSingleton.instance.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        } else {
            console.error('WebSocket server is not initialized.');
        }
    }
}

module.exports = WebSocketServerSingleton;
