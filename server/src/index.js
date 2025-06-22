const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use(cors());

// Setup storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// By default, Express does not allow public access to internal folders unless you explicitly say so. So it tells your Express server to serve the uploaded files as static files — so they can be accessed via URL in the browser.

app.post("/profile", upload.single("file"), function (req, res, next) {
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    const { socketId } = req.body;

    if (socketId) {
        // Send to everyone except sender
        io.sockets.sockets.forEach((socket) => {
            if (socket.id !== socketId) {
                socket.emit("file-uploaded", {
                    fileUrl,
                    fileName: req.file.originalname,  // original file name as in the user's device
                });
            }
        });
    };

    res.json({ fileUrl });
});

// Setup socket
io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on("send-message", (message) => {
        socket.broadcast.emit("receive-message", message);
    });

    socket.on("disconnect", () => {
        console.log(`user disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
