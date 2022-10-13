const express = require("express");
const path = require("path");
const fs = require("fs");

const { getUsers } = require("../functions")

const bookRouter = express.Router();


// CreateBook
bookRouter.post("/", async(req, res) => {
    const book = await addBook(req, res)
        .then((book) => {
            res.statusCode = 201;
            res.end(book);
        })
        .catch((error) => {
            res.statusCode = error.statusCode
            res.end(JSON.stringify(error))
        })
});

// LoanOutBook(s)
bookRouter.post("/out", async(req, res) => {
    const book = await loanBook(req, res)
        .then((book) => {
            res.end(book);
        })
        .catch((error) => {
            res.statusCode = error.statusCode
            res.end(JSON.stringify(error));
        })
});

// ReturnBook(s)
bookRouter.post("/in", async(req, res) => {
    const book = await returnBook(req, res)
        .then((book) => {
            res.end(book);
        })
        .catch((error) => {
            res.statusCode = error.statusCode
            res.end(JSON.stringify(error));
        })
});

// UpdateBook
bookRouter.put('/', async(req, res) => {
    const book = await updateBook(req, res)
        .then((book) => {
            res.end(book);
        })
        .catch((error) => {
            res.statusCode = error.statusCode
            res.end(JSON.stringify(error));
        })
})

// DeleteBook
bookRouter.delete("/:id", async(req, res) => {
    const book = await removeBook(req, res)
        .then((books) => {
            res.end(books);
        })
        .catch((error) => {
            res.statusCode = error.statusCode
            res.end(JSON.stringify(error));
        })
});

module.exports = bookRouter