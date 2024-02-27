// Include dependencies:
const websocket = require("websocket").server;
const http = require("http");

// Local variables:
const port = process.env.PORT || 9600; // Use the environment variable for port

// Create the server and listen on the specified port:
const server = http.createServer();

server.listen(port, function() {
    console.log("Server listening on port " + port);
});

// Initialize the WebSocket server:
const wsServer = new websocket({
    httpServer: server,
});

const connections = []; // Store active connections

// Handle incoming WebSocket requests:
wsServer.on("request", function(req) {
    const connection = req.accept(null, req.origin);

    connections.push(connection);

    connection.on("message", function(message) {
        // Broadcast the received message to all connected clients:
        for (let i = 0; i < connections.length; i++) {
            connections[i].sendUTF(message.utf8Data);
        }
        console.log(message);
    });

    connection.on("close", function(reasonCode, description) {
        // Remove closed connections from the list:
        const index = connections.indexOf(connection);
        if (index !== -1) {
            connections.splice(index, 1);
        }
    });

    connection.on("open", function(reasonCode, description) {
        console.log(connections);
    });
});
