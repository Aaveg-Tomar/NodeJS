const express = require('express');
const fs = require('fs');

const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;


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

app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
})


// REST API 
app.get('/api/users', (req, res) => {
    return res.json(users);

});

app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if(!user){
        return res.status(404).json({msg:"Invalid ID"});
    }

    return res.json(user);
});


app.post('/api/users', (req, res) => {
    // Create the user 
    const body = req.body;
    if (!body || !body.first_name || !body.email || !body.last_name || !body.gender || !body.job_title){
        return res.status(400).json({msg:"All fileds are required"})
    }
        console.log("Body", body);

    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (error, data) => {
        return res.status(201).json({ status: "Success", id: users.length });
    })

})

app.patch('/api/users/:id', (req, res) => {
    // EDIT the user with ID
    return res.json({ status: "path pending" });
})

app.delete('/api/users/:id', (req, res) => {
    // DELET the user with ID
    return res.json({ status: "delete pending" });
})

app.listen(PORT, () => {
    console.log('App listening on port 8000!');
});