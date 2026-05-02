const http = require("http");
const app = require("./src/app");
const jwt = require("jsonwebtoken");
const Message = require("./src/models/Message.js");

const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// middleware socket
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch {
        next(new Error("Invalid token"));
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.user.email);

    socket.join(socket.user.email);

    socket.on("sendMessage", async (data) => {
        const senderEmail = socket.user.email;
        const { receiverEmail, content } = data;

        const message = new Message({
            senderEmail,
            receiverEmail,
            content,
            createdAt: new Date()
        });

        await message.save();

        io.to(receiverEmail).emit("receiveMessage", message);
        socket.emit("receiveMessage", message);
    });
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});