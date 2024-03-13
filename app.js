const fs = require('fs');
const http = require('http');
const WebSocket = require('websocket').server;

// Local variables:
const port = process.env.PORT || 9600; // Use the environment variable for port

// Create the server and listen on the specified port:
const server = http.createServer();

server.listen(port, function() {
    console.log("Server listening on port " + port);
});

// Initialize the WebSocket server:
const wsServer = new WebSocket({
    httpServer: server,
    autoAcceptConnections: false, // Disable auto-accept to handle compression
    maxReceivedFrameSize: 4096 * 4096, // Set maximum frame size (adjust as needed)
    maxReceivedMessageSize: 4096 * 4096, // Set maximum message size (adjust as needed)
    perMessageDeflate: true, // Enable permessage-deflate extension
});

const connections = []; // Store active connections

// Handle incoming WebSocket requests:
wsServer.on('request', function(req) {
    const connection = req.accept(null, req.origin);

    connections.push(connection);

    connection.on('message', async function(message) {
        const msg = message.utf8Data;

        for (let i = 0; i < connections.length; i++) {
            connections[i].sendUTF(msg);
        }
    });

    connection.on('close', function(reasonCode, description) {
        // Remove closed connections from the list:
        const index = connections.indexOf(connection);
        if (index !== -1) {
            connections.splice(index, 1);
        }
    });
    connection.on('open', function(reasonCode, description) {
        // Remove closed connections from the list:
        const index = connections.indexOf(connection);
        console.log(connection);
        console.log(connections);
    });
});
