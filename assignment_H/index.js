const http = require("http");
const path = require('path');
const fs = require("fs");

const PORT = 8080;
const path_to_user_db = path.join(__dirname, "db", "users.json")
const path_to_book_db = path.join(__dirname, "db", "books.json")
const path_to_test_user_db = path.join(__dirname, "db", "users_test.json")

const getAllUsers = () => {
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
const getAllBooks = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path_to_book_db,"utf-8", (err, users) => {
            if(err) {
                reject(err)
                return
            }
            if(books){
                resolve(JSON.parse(books));
                return
            }
            resolve([])
        })
    })
}

const addUser = (req, res) => {
    return new Promise((resolve, reject) => {
        body = []
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', async() => {
            const parsedBody = Buffer.concat(body).toString()
            if (!parsedBody){
                reject({
                    statusCode: 400,
                    message: "Bad request"
                });
                return
            }
            const bodyObject = JSON.parse(parsedBody);
            const { name, role, email, password } = bodyObject;

            // Get all users from database file
            const all_users = await getAllUsers()
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
    })
}

const addBook = (req, res) => {
    return new Promise(async(resolve, reject) => {
        body = []
        const user = await authenticateAdmin(req, res)
        console.log(user);
        // if(!user){

        // }
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', async() => {
            const parsedBody = Buffer.concat(body).toString()
            if (!parsedBody){
                reject({
                    statusCode: 400,
                    message: "Bad request"
                });
                return
            }
            const bodyObject = JSON.parse(parsedBody);
            const { name, role, email, password } = bodyObject;

            // Get all users from database file
            const all_users = await getAllUsers()
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
    })
}

const authenticateUser = (req, res) => {
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
                });
                return;
            }

            parsedBody = JSON.parse(bufferString)

            const users = await getAllUsers()
            const authenticatedUser = users.filter((user) => user.email === parsedBody.email && user.password === parsedBody.password)
            console.log(authenticatedUser)
            if(!authenticatedUser.length){
                console.log("here")
                reject({
                    statusCode: 401,
                    message: "Unauthenticated"
                })
            }else{
                resolve(authenticatedUser)
            }
        })
    })
}

const authenticateAdmin = async(req, res) => {
    const all_users = await getAllUsers();
    const authenticatedUser= await authenticateUser(req, res)
    
    if(authenticatedUser[0].role === "admin"){
        return all_users
    }else{
       return false;
    }
}

const loginUser = () => {

}

const requestHandler = async(req, res) => {
    res.setHeader=["Content-Type", "application/json"]
    // CreateUser
    if(req.url === "/users" && req.method === "POST"){
        const user = await addUser(req, res)
        .then((user) => {
            res.statusCode = 201;
            res.end(user);
        })
        .catch((error) => {
            res.statusCode = 400
            res.end(JSON.stringify(error))
        })
    }
    // AuthenticateUser
    else if(req.url == "/users/auth" && req.method == "POST"){
        const user = await authenticateUser(req, res)
        .then((user) => {
            res.statusCode = 200;
            res.end(JSON.stringify(user));
        })
        .catch((error) => {
            res.statusCode = 400
            res.end(JSON.stringify(error))
        })
    }
    // GetAllUsers
    else if(req.url == "/users" && req.method == "GET"){
        try{
            const users = await authenticateAdmin(req, res);
            res.end(JSON.stringify(users));
        }
        catch(err) {
            const error = {
                statusCode: 403,
                message: "Unauthorized"
            }
            res.statusCode = 403
            res.end(JSON.stringify(error))
        }
    }
    // CreateBook
    else if(req.url == "/books" && req.method == "POST"){
        const book = await addBook(req, res)
        .then((book) => {
            res.statusCode = 201;
            res.end(book);
        })
        .catch((error) => {
            res.statusCode = 400
            res.end(JSON.stringify(error))
        })
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