const User = require("../models/user")

const handleGetAllUsers = async(req , res) =>{
    const allDBUsers = await User.find({});
    return res.json(allDBUsers);

}

const handleGetUserById = async(req , res) =>{
    const user = await  User.findById(req.params.id)

    if(!user){
        return res.status(404).json({msg:"Invalid ID"});
    }
    return res.json(user);
}

const handleUpdateUserById = async(req , res) =>{
    await User.findByIdAndUpdate(req.params.id , {lastName : "Changed"})
    
    return res.json({ status: "Success" });
}

const handleDeleteUserById = async(req , res) =>{
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
}


const handleCreateNewUser = async(req , res) =>{
    const body = req.body;
    if (!body || !body.first_name || 
        !body.email || !body.last_name ||
         !body.gender || !body.job_title){

        return res.status(400).json({msg:"All fileds are required"})
    }
    
    // Now Working with mongoDB 

    const result = await User.create({
        firstName : body.first_name,
        lastName :  body.last_name,
        email : body.email,
        gender: body.gender,
        jobTitle : body.job_title, 
    });

    return res.status(201).json({ msg : "Success" , id: result._id})
}




module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser,
}