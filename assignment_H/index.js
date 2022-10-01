const http = require("http");
const path = require('path');
const fs = require("fs");

const PORT = 8080;
const path_to_user_db = path.join(__dirname, "db", "users.json")
const path_to_book_db = path.join(__dirname, "db", "books.json")
const path_to_test_user_db = path.join(__dirname, "db", "users_test.json")

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
const getBooks = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path_to_book_db,"utf-8", (err, books) => {
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
    })
}


const addBook = (req, res) => {
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
            const { books, email, password } = bodyObject;

            const user = await authenticateAdmin(email, password);
            if(user.statusCode){
                reject(user)
                return
            }
            // Get all books from database file
            const all_books = await getBooks()
            if(!books){
                reject({
                    statusCode: 400,
                    message: "Bad Request"
                });
                return;
            }
            for(let book of books){
                new_book= {
                    ...book, available: true
                }
                all_books.push(new_book);
            }
            fs.writeFile(path_to_book_db, JSON.stringify(all_books), (err) => {
                if(err){
                    reject(err)
                }
                resolve(JSON.stringify(all_books));
            })
        })
    })
}


const loginUser = (req, res) => {
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
    })
}

const getAllUsers = (req, res) => {
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
                return;
            }
            const bodyObject = JSON.parse(parsedBody);
            const { email, password } = bodyObject;

            const users = await authenticateAdmin(email, password);
            if(users.statusCode){
                reject(users)
                return
            }
            resolve(users)
        })
    })
}

const removeBook = async(req, res) => {
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
                return;
            }
            const bodyObject = JSON.parse(parsedBody);
            const { books, email, password } = bodyObject;

            const users = await authenticateAdmin(email, password);
            if(users.statusCode){
                reject(users);
                return;
            }
            
            // Delete book from database
            let all_books = await getBooks();
            for(let book of books){
                const title = book.title.trim();
                if(!title){
                    reject({
                        statusCode: 400,
                        message: "Bad Request"
                    });
                    return;
                }
                // Filter out other remaining books
                remainder_books = all_books.filter(in_book => in_book.title.trim() !== title);
                // Check if anything was removed
                if(all_books.length === remainder_books.length){
                    reject({
                        statusCode: 404,
                        message: "Not found"
                    });
                    return;
                }
            }
            
            fs.writeFile(path_to_book_db, JSON.stringify(remainder_books), (err) => {
                if(err){
                    reject(err)
                }
                resolve(JSON.stringify(remainder_books));
            })
        })
    })
}

const loanBook = (req, res) => {
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
                return;
            }
            const bodyObject = JSON.parse(parsedBody);
            const { books, email, password } = bodyObject;

            const user = await authenticateUser(email, password);
            if(!user){
                reject({
                    statusCode: 401,
                    message: "Not Authenticated"
                });
                return;
            }
            let all_books = await getBooks();
            let books_to_loan = [];
            for(let book of books){
                const title = book.title.trim();
                if(!title){
                    reject({
                        statusCode: 400,
                        message: "Bad Request"
                    });
                    return;
                }
                // Check if the book is available
                let book_to_loan = all_books.filter(in_book => in_book.title.trim() === title);
                if(!book_to_loan.length){
                    reject({
                        statusCode: 404,
                        message: "Not found"
                    });
                    return;
                }
                book_to_loan.forEach(book => {
                    if(book.available == false){
                        error = {
                         title: title,
                         message: "Book is not available!"
                        }
                        books_to_loan.push(error)
                    }else{
                        books_to_loan.push(...book_to_loan)
                    }
                });
            }
            resolve(JSON.stringify(books_to_loan));
        })
    })
}

const returnBook = (req, res) => {
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
                return;
            }
            const bodyObject = JSON.parse(parsedBody);
            const { books, email, password } = bodyObject;

            const user = await authenticateUser(email, password);
            if(!user){
                reject({
                    statusCode: 401,
                    message: "Not Authenticated"
                });
                return;
            }
            let all_books = await getBooks();
            let books_to_loan = [];
            for(let book of books){
                const title = book.title.trim();
                if(!title){
                    reject({
                        statusCode: 400,
                        message: "Bad Request"
                    });
                    return;
                }
                // Check if the book is available
                let book_to_loan = all_books.filter(in_book => in_book.title.trim() === title);
                if(!book_to_loan.length){
                    reject({
                        statusCode: 404,
                        message: "Not found"
                    });
                    return;
                }
                book_to_loan.forEach(book => {
                    if(book.available == false){
                        error = {
                         title: title,
                         message: "Book is not available!"
                        }
                        books_to_loan.push(error)
                    }else{
                        books_to_loan.push(...book_to_loan)
                    }
                });
            }
            resolve(JSON.stringify(books_to_loan));
        })
    })
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
        const user = await loginUser(req, res)
        .then((user) => {
            res.statusCode = 200;
            res.end(JSON.stringify(user));
        })
        .catch((error) => {
            res.statusCode = error.statusCode;
            res.end(JSON.stringify(error))
        })
    }
    // GetAllUsers
    else if(req.url == "/users" && req.method == "GET"){
        const users = await getAllUsers(req, res)
        .then((users) => {
            res.end(JSON.stringify(users));
        }).catch((error) => {
            res.statusCode = error.statusCode;
            res.end(JSON.stringify(error));
        })
           
    }
    // CreateBook
    else if(req.url == "/books" && req.method == "POST"){
        const book = await addBook(req, res)
        .then((book) => {
            res.statusCode = 201;
            res.end(book);
        })
        .catch((error) => {
            res.statusCode = error.statusCode
            res.end(JSON.stringify(error))
        })
    }
    // DeleteBook
    else if(req.url == "/books" && req.method == "DELETE"){
        const book = await removeBook(req, res)
        .then((books) => {
            res.end(books);
        })
        .catch((error) => {
            res.statusCode = error.statusCode
            res.end(JSON.stringify(error));
        })
    }
    // LoanOutBook(s)
    else if(req.url == "/books/out" && req.method == "POST"){
        const book = await loanBook(req, res)
        .then((book) => {
            res.end(book);
        })
        .catch((error) => {
            res.statusCode = error.statusCode
            res.end(JSON.stringify(error));
        })
    }
    // ReturnBook(s)
    else if(req.url == "/books/in" && req.method == "POST"){
        const book = await returnBook(req, res)
        .then((book) => {
            res.end(book);
        })
        .catch((error) => {
            res.statusCode = error.statusCode
            res.end(JSON.stringify(error));
        })
    }
    // UpdateBook
    else if(req.url == "/books" && req.method == "PUT"){
        res.end("Updating Book...");
    }else{
        res.statusCode = 404;
        res.end("Route not found");
    }
}

// {
//     "email": "esther123@example.com",
//     "password": "esther_password",
//     "books": [{
//       "author": "Chinua Achebe",
//       "title": "Things Fall Apart",
//       "year": 1958
//     },{
//       "author": "Chimamanda Ngozi Adiche",
//       "title": "Half of a Yellow Sun",
//       "year": 2006
//     },{
//       "author": "Chimamanda Ngozi Adiche",
//       "title": "Purple Hibiscus",
//       "year": 2003
//     }]
// }

// Create a new server
const server = http.createServer(requestHandler);

server.listen(PORT,'127.0.0.1', () => console.log(`Server is running on port ${PORT}`));