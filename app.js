// Include dependencies:
const http = require("http");
const socketIO = require("socket.io");

// Local variables:
const port = process.env.PORT || 9600; // Use the environment variable for port

// Create the server and listen on the specified port:
const server = http.createServer();

server.listen(port, function() {
    console.log("Server listening on port " + port);
});

// Initialize the Socket.IO server:
const io = socketIO(server);

// Handle incoming Socket.IO connections:
io.on('connection', function(socket) {
    console.log('A user connected');

    socket.on('message', function(data) {
        // Broadcast the received message to all connected clients:
        io.emit('message', data);
    });

    socket.on('disconnect', function() {
        console.log('A user disconnected');
    });
});
