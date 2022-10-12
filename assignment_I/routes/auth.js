const express = require("express");
const path = require("path");
const fs = require("fs");

const { getUsers } = require("./functions")

const authRouter = express.Router();

const path_to_user_db = path.join(__dirname, "db", "users.json")

const addUser = (req, res) => {
    return new Promise((resolve, reject) => {
        const bodyObject = req.body;
        const { name, role, email, password } = bodyObject;

        // Get all users from database file
        const all_users = await getUsers()
        if(!name || !role || !email || !password){
            reject({
                statusCode: 400,
                message: "Bad Request"
            });
            return;
        }
        all_users.push(bodyObject);
        fs.writeFile(path_to_user_db, JSON.stringify(all_users), (err) => {
            if(err){
                reject(err)
            }
            resolve(JSON.stringify(bodyObject));
        })
    })
}

const loginUser = (req, res) => {
    return new Promise((resolve, reject) => {
        const bodyObject = JSON.parse(parsedBody);
        const { email, password } = bodyObject;

        const user = await authenticateUser(email, password);
        if(!user){
            reject({
                statusCode: 401,
                message: "Not Authenticated"
            });
            return;
        }
        resolve(user);
    })
}

authRouter.post("/signup", (req, res) => {
    const user = await addUser(req, res)
        .then((user) => {
            res.statusCode = 201;
            res.end(user);
        })
        .catch((error) => {
            res.statusCode = 400
            res.end(JSON.stringify(error))
        })
});

authRouter.post("/login", (req, res) => {
    const user = await loginUser(req, res)
        .then((user) => {
            res.statusCode = 200;
            res.end(JSON.stringify(user));
        })
        .catch((error) => {
            res.statusCode = error.statusCode;
            res.end(JSON.stringify(error))
        })
});

module.exports = authRouter;