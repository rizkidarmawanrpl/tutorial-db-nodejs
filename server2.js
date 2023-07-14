const express       = require('express');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const port     = process.env.APP_PORT;
const host     = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const user     = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const app      = express();

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "views");

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
        console.log('database connected...');

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

app.listen(port, () => {
    console.log("server ready...");
});