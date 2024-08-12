const express = require('express');

const {connectMongoDb} = require("./connection");

const { logReqRes } = require("./middlewares");

const UserRouter = require("./routes/user");

// const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Connection
connectMongoDb('mongodb://127.0.0.1:27017/project-app').then(()=>{
    console.log("Db Connected")
})

// Middleware of Express (Act as plugIN)
app.use(express.urlencoded({ extends: false }));

app.use(logReqRes("log.txt"));

// Routes
app.use('/api/user' , UserRouter);

app.listen(PORT, () => {
    console.log('App listening on port 8000!');
});