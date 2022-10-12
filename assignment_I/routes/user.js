const express = require("express");
const path = require("path");
const fs = require("fs");

const { getUsers } = require("./functions")

const userRouter = express.Router();


// GetAllUsers
userRouter.get("/", (req, res) => {

})


module.exports = userRouter;