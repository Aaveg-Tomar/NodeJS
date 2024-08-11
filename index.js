const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');

// const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Connection
mongoose.connect('mongodb://127.0.0.1:27017/project-app')
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo Error", err));


// Schema
const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName:{
        type: String,
    },
    email: {
        type : String,
        required : true,
        unique: true,
    },
    jobTitle:{
        type : String,
    },
    gender : {
        type : String,
    }
} , {timestamps : true});

const User = mongoose.model("user" , userSchema);


// Middleware of Express (Act as plugIN)
app.use(express.urlencoded({ extends: false }));


// Without the next() you cannot go access futher routes
app.use((req, res, next) => {
    console.log("Middleware 1");
    req.myUserName = "AavegTomar"
    next();
})

app.use((req, res, next) => {
    console.log("Middleware 2", req.myUserName);
    // return res.end('Hey')
    next();  // if here we donot use next it does not access the routes 
})

// Routes

app.get('/users', async(req, res) => {
    const allDBUsers = await User.find({});
    const html = `
    <ul>
    ${allDBUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join('')}
    </ul>
    `;
    res.send(html);
})


// REST API 
app.get('/api/users', async(req, res) => {
    const allDBUsers = await User.find({});

    return res.json(allDBUsers);

});



app.get('/api/users/:id', async(req, res) => {

    //-----------------------------------------------------
    // It is used with MOCK DATA
    // const id = Number(req.params.id);
    // const user = users.find((user) => user.id === id);

    // ----------------------------------------------------

    const user = await  User.findById(req.params.id)

    if(!user){
        return res.status(404).json({msg:"Invalid ID"});
    }

    return res.json(user);
});



app.post('/api/users', async(req, res) => {
    // Create the user 
    const body = req.body;
    if (!body || !body.first_name || 
        !body.email || !body.last_name ||
         !body.gender || !body.job_title){

        return res.status(400).json({msg:"All fileds are required"})
    }
        // console.log("Body", body);


    // ------------------------------------------------------------

    // This use for the when changes in local data that is MOCKDATA

    // users.push({ ...body, id: users.length + 1 });
    // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (error, data) => {
    //     return res.status(201).json({ status: "Success", id: users.length });
    // })

    // -------------------------------------------------------------
    
    // Now Working with mongoDB 

    const result = await User.create({
        firstName : body.first_name,
        lastName :  body.last_name,
        email : body.email,
        gender: body.gender,
        jobTitle : body.job_title, 
    });

    return res.status(201).json({ msg : "Success"})


})




app.patch('/api/users/:id', async(req, res) => {
    // EDIT the user with ID
    await User.findByIdAndUpdate(req.params.id , {lastName : "Changed"})
    
    return res.json({ status: "Success" });
})



app.delete('/api/users/:id', async(req, res) => {
    // DELET the user with ID
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
})



app.listen(PORT, () => {
    console.log('App listening on port 8000!');
});