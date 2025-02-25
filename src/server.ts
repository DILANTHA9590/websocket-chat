import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocket, WebSocketServer } from 'ws'; // server

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Create a server
const server = http.createServer(app); // HTTP server
const wss = new WebSocketServer({ server }); // WebSocket server

wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");

    // Listen for messages from this client
    ws.on("message", (data) => {
        console.log("Received a message from the client: " + data);

        // Broadcast the message to all other clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    // Handle client disconnecting
    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
