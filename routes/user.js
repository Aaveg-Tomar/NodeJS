const express = require('express');

const { handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser } = require("../controllers/user");

const router = express.Router();

const User = require("../models/user")

router.get('/', handleGetAllUsers);

router.post('/', handleCreateNewUser)

router.get('/:id', handleGetUserById);

router.patch('/:id', handleUpdateUserById)

router.delete('/:id', handleDeleteUserById)

module.exports = router;