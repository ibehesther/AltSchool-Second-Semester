const fs = require("fs");
const path = require("path");

const path_to_user_db = path.join(__dirname, "db", "users.json");

const getUsers = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path_to_user_db,"utf-8", (err, users) => {
            if(err) {
                reject(err)
                return
            }
            if(users){
                resolve(JSON.parse(users));
                return
            }
            resolve([])
        })
    })
}

const authenticateUser = async(email, password) => {
    const users = await getUsers()
    const authenticatedUser = users.filter((user) => user.email === email && user.password === password)
    
    if(!authenticatedUser.length){
        return false
    }else{
        return authenticatedUser
    }
}

const authenticateAdmin = async(email, password) => {
    const all_users = await getUsers();
    const authenticatedUser= await authenticateUser(email, password)
    if (!authenticatedUser){
        return ({
            statusCode: 401,
            message: "Unauthenticated"
        })
    }
    if(authenticatedUser[0].role === "admin"){
        return all_users
    }else{
       return ({
        statusCode: 403,
        message: "Unauthorized"
    });
    }
}

module.exports = { path_to_user_db, getUsers, authenticateUser, authenticateAdmin }