const express = require("express");
const path = require("path");
const fs = require("fs");

const { getUsers } = require("./functions")

const bookRouter = express.Router();


// CreateBook
bookRouter.post("/", (req, res) => {

});

// LoanOutBook(s)
bookRouter.post("/out", (req, res) => {

});

// ReturnBook(s)
bookRouter.post("/in", (req, res) => {

});

// DeleteBook
bookRouter.delete("/:id", (req, res) => {

});

module.exports = bookRouter