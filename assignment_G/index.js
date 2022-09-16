const http = require("http");

const PORT = 8080;


const requestHandler = (req, res) => {
    // CreateUser
    if(req.url === "/users" && req.method === "POST"){
        res.statusCode = 201;
        res.end("Creating User...");
    }
    // AuthenticateUser
    else if(req.url == "/users/auth" && req.method == "POST"){
        res.end("Authenticating User...");
    }
    // GetAllUsers
    else if(req.url == "/users" && req.method == "GET"){
        res.end("Getting Users...");
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