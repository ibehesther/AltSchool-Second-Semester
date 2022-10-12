const fs = require("fs");

export const getUsers = () => {
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

export const authenticateUser = async(email, password) => {
    const users = await getUsers()
    const authenticatedUser = users.filter((user) => user.email === email && user.password === password)
    
    if(!authenticatedUser.length){
        return false
    }else{
        return authenticatedUser
    }
}