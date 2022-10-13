const express = require("express");
const path = require("path");
const fs = require("fs");

const { getUsers, authenticateAdmin } = require("../functions")

const userRouter = express.Router();


const getAllUsers = (req, res) => {
    return new Promise((resolve, reject) => {
        (async() => {
            const bodyObject = req.body;
            const { email, password } = bodyObject;

            const users = await authenticateAdmin(email, password);
            if(users.statusCode){
                reject(users)
                return
            }
            resolve(users)
        })();
    })
}

// GetAllUsers
userRouter.get("/", async(req, res) => {
    const users = await getAllUsers(req, res)
        .then((users) => {
            res.end(JSON.stringify(users));
        }).catch((error) => {
            res.statusCode = error.statusCode;
            res.end(JSON.stringify(error));
        })
})


module.exports = userRouter;