import app from "../src/app";
import http from "http";
import { Server } from "Socket.io"
import cors from "cors";

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

server.listen(port, () => console.log(`🏃 The server is run on port ${port} 🚀 `));
server.on('error', onError);
server.on('listening', onListening);

io.on("connection", (socket) => {
    console.log(`User conected in socket.io ${socket.id}`);
})

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port))
        return val;

    if (port >= 0)
        return port;

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen')
        throw error;

    const bind = typeof port === 'string' ?
        'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;

    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}
