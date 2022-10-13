const express = require("express");
const path = require("path");
const fs = require("fs");

const { path_to_user_db, getUsers, authenticateUser } = require("../functions");

const authRouter = express.Router();

const addUser = (req, res) => {
    return new Promise((resolve, reject) => {
        (async() => {
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
        })();
        
    })
}

const loginUser = (req, res) => {
    return new Promise((resolve, reject) => {
        (async() => {
            const bodyObject = req.body;
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
        })();
    })
}

authRouter.post("/signup", async(req, res) => {
    const user = await addUser(req, res)
        .then((user) => {
            res.statusCode = 201;
            res.send(user);
        })
        .catch((error) => {
            res.statusCode = 400
            res.send(JSON.stringify(error))
        })
});

authRouter.post("/login", async(req, res) => {
    const user = await loginUser(req, res)
        .then((user) => {
            res.status(200).send(JSON.stringify(user));
        })
        .catch((error) => {
            res.status(error.statusCode).send(JSON.stringify(error))
        })
});

// {
//     "email": "esther123@example.com",
//     "password": "esther_password",
//     "books": [{
//         "author": "Chinua Achebe",
//         "title": "Things Fall Apart",
//         "year": 1958
//     },{
//         "author": "Chimamanda Ngozi Adiche",
//         "title": "Half of a Yellow Sun",
//         "year": 2006
//     },{
//         "author": "Chimamanda Ngozi Adiche",
//         "title": "Purple Hibiscus",
//         "year": 2003
//     },{
//         "author": "Wole Soyinka",
//         "title": "Chronicles from the Land of the Happiest People on Earth",
//         "year": 2021
//     }]
// }

module.exports = authRouter;