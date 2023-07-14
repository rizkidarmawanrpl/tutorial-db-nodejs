const express    = require('express');
// const mysql      = require('mysql');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
// const moment     = require('moment');
// const tedious = require('tedious');
// const sql = require('mssql');
// const http       = require('http');
// const {Server}   = require('socket.io');
/*const {
    host,
    database,
    user,
    password,
    corsOrigin
} = require('./env');*/
require('dotenv').config();

const port       = process.env.APP_PORT;
const host       = process.env.DB_HOST;
const database   = process.env.DB_DATABASE;
const user       = process.env.DB_USERNAME;
const password   = process.env.DB_PASSWORD;
const app        = express();
// const server = http.createServer(app);
// const io     = new Server(server, { cors: { origin: corsOrigin} });

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "views");

/* const config = {
    server        : host,
    authentication: {
        type   : 'default',
        options: {
            userName: user,
            password: password
        }
    },
    options: {
        trustServerCertificate: true,
        database              : database
    }
}; */

/* const config = {
    user    : user,
    password: password,
    server  : host,
    database: database,
    options : {
        trustServerCertificate  : true
    }
}; */

/* async () => {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    
        // Perform your database operations here
        const result = await sql.query('SELECT TOP 1 * FROM IK_USER');
        console.log(result.recordset);
    
        // Close the connection
        await sql.close();
        console.log('Disconnected from SQL Server');
    } catch (error) {
        console.error('Error connecting to SQL Server:', error);
    }
} */

const sequelize = new Sequelize(database, user, password, {
    host          : host,
    dialect       : 'mssql',
    dialectOptions: {
        trustServerCertificate: true
    }
});

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        app.get("/", (req, res) => {
            res.send("HELLO WORLD");
        });

        app.post("/user", (req, res) => {
            const User = sequelize.define("user", {
                USER_ID: {
                    type      : Sequelize.STRING,
                    primaryKey: true,
                },
                KD_JABATAN: {
                    type: Sequelize.STRING
                },
                NAMA: {
                    type: Sequelize.STRING
                }
            }, {
                tableName: 'IK_USER',
                createdAt: 'TGL_ENTRY',
                updatedAt: 'TGL_UPDATE',
            });
    
            const USER_ID = '200901060';
    
            User.findByPk(USER_ID)
            .then(data => {
                res.send({data: data.dataValues});
            })
            .catch(err => {
                res.send({message: "Error retrieving User with id = " + USER_ID});
            });
        });

        app.post("/bulan", (req, res) => {
            const Bulan = sequelize.define("bulan", {
                BULAN: {
                    type      : Sequelize.INTEGER,
                    primaryKey: true,
                },
            }, {
                tableName : 'ABS_BLN',
                timestamps: false,
            });

            Bulan.findAll()
            .then(data => {
                res.send({data: data});
            })
            .catch(err => {
                res.send({message: "Error retrieving Bulan => " + JSON.stringify(err)});
            });
        });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectToDatabase();

/* const connection = new tedious.Connection(config);

connection.on('connect', (err) => {
    if (err) {
        console.error('Error connecting to SQL Server:', err);
        connection.close();
    } else {
        console.log('Connected to SQL Server');
        // Perform your database operations here
    }
});
  
connection.on('errorMessage', (err) => {
    console.error('SQL Server Error:', err);
});

connection.connect(); */

/* function executeStatement () {
    const request = new Request("SELECT 123, 'hello world'", (err, rowCount) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`${rowCount} rows`);
        }
        connection.close();
    });

    request.on('row', (columns) => {
        columns.forEach((column) => {
            if (column.value === null) {
                console.log('NULL');
            } else {
                console.log(column.value);
            }
        });
    });

    connection.execSqlBatch(request);
    // connection.execSql(request);
} */

/* const db = mysql.createConnection({
    host    : host,
    database: database,
    user    : user,
    password: password,
}); */

/* db.connect((err) => {
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
}); */

/* io.on("connection", (socket) => {
    socket.on("message", (data) => {
        const {id, message} = data;
        socket.broadcast.emit("message", id, message);
    });

    socket.on("push", (data) => {
        const {id} = data;
        socket.broadcast.emit("push", id);
    });
}); */

app.listen(port, () => {
    console.log("server ready...");
});