const express  = require('express');
const mysql    = require('mysql');
const moment   = require('moment');
const http     = require('http');
const {Server} = require('socket.io');
require('dotenv').config();

const port       = process.env.APP_PORT;
const corsOrigin = process.env.APP_CORS_ORIGIN;
const host       = process.env.DB_HOST;
const database   = process.env.DB_DATABASE;
const user       = process.env.DB_USERNAME;
const password   = process.env.DB_PASSWORD;
const app        = express();
const server     = http.createServer(app);
const io         = new Server(server, { cors: { origin: corsOrigin} });

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "views");

const db = mysql.createConnection({
    host    : host,
    database: database,
    user    : user,
    password: password,
});

db.connect((err) => {
    if (err) throw err;
    console.log("database connected...");

    app.get("/", (req, res) => {
        const sql = "SELECT * FROM member";
        db.query(sql, (err, result) => {
            if (err) throw err;

            const members = JSON.parse(JSON.stringify(result));
            res.render("index", {members: members, title: "DAFTAR MEMBER"});
        });
    });

    app.post("/tambah", (req, res) => {
        const insertSql = `INSERT INTO member (nama, domisili, created_at) VALUES ('${req.body.nama}', '${req.body.domisili}', '${moment().format("YYYY/MM/DD HH:mm:ss")}');`;
        db.query(insertSql, (err, result) => {
            if (err) throw err;

            res.redirect("/");
        });
    });

    app.get("/chat", (req, res) => {
        res.render("chat", {title: "MASUK FORUM", titleChat: "DISKUSI TERBUKA"});
    });

    app.get("/monitoring", (req, res) => {
        res.render("monitoring", {title: "Monitoring"});
    });
});

io.on("connection", (socket) => {
    socket.on("message", (data) => {
        const {id, message} = data;
        socket.broadcast.emit("message", id, message);
    });

    socket.on("push", (data) => {
        const {id} = data;
        socket.broadcast.emit("push", id);
    });
});

server.listen(port, () => {
    console.log("server ready...");
});