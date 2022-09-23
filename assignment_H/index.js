const http = require("http");
const path = require('path');
const fs = require("fs");

const PORT = 8080;
const dir = path.dirname(__filename)
const path_to_user_db = path.join(__dirname, "db", "users.json")

// content = [{
//     test: "This is a test"
// }]
// fs.writeFile(path_to_db, content, (err, file) => {
//     console.log(err, file)
// })
const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path_to_user_db,"utf-8", (err, file) => {
            if(err) {
                reject(err)
                return
            }
           resolve(JSON.parse(file));
        })
    })
}

const authenticateAdmin = (req, res) => {
    return new Promise((resolve, reject) => {
        body = []
        req.on("data", (chunk) => {
            body.push(chunk)
        })
        req.on("end", async() => {
            bufferString = Buffer.concat(body).toString();

            if(!bufferString){
                reject({
                    statusCode: 400,
                    message: "No username or password provided"
                })
            }

            parsedBody = JSON.parse(bufferString)

           
            const users = await getAllUsers()
            
            for( let user of users){
                if(user.email === parsedBody.email && user.password === parsedBody.password){
                    if(user.role === "admin"){
                        resolve(users)
                        return 
                    }else{
                        reject({
                            statusCode: 403,
                            message: "Unauthorized"
                        })
                    }
                }else{
                    reject({
                        statusCode: 401,
                        message: "Unauthenticated"
                    })
                }
            }
        })
    })
}

const requestHandler = async(req, res) => {
    res.setHeader=["Content-Type", "application/json"]
    // CreateUser
    if(req.url === "/users" && req.method === "POST"){
        body = []
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            const bodyObject = JSON.parse(parsedBody);

            const { name, age, email, password } = bodyObject
            res.statusCode = 201;
            // res.end("Creating User...");
            res.end(name);
        })
    }
    // AuthenticateUser
    else if(req.url == "/users/auth" && req.method == "POST"){
        res.end("Authenticating User...");
    }
    // GetAllUsers
    else if(req.url == "/users" && req.method == "GET"){
        try{
            const users = await authenticateAdmin(req, res)
            res.end(JSON.stringify(users));
        }catch(err){
            res.statusCode = err.statusCode
            res.end(JSON.stringify(err))
        }
        
    }
    // CreateBook
    else if(req.url == "/books" && req.method == "POST"){
        res.statusCode = 201;
        res.end("Creating Book...");
    }
    // DeleteBook
    else if(req.url == "/books" && req.method == "DELETE"){
        res.end("Deleting Book...");
    }
    // LoanOutBook(s)
    else if(req.url == "/books/out" && req.method == "POST"){
        res.end("Loaning Book...");
    }
    // ReturnBook(s)
    else if(req.url == "/books/in" && req.method == "POST"){
        res.end("Returning Book...");
    }
    // UpdateBook
    else if(req.url == "/books" && req.method == "PUT"){
        res.end("Updating Book...");
    }else{
        res.statusCode = 404;
        res.end("Route not found");
    }
}

// Create a new server
const server = http.createServer(requestHandler);

server.listen(PORT,'127.0.0.1', () => console.log(`Server is running on port ${PORT}`));