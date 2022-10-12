const express = require("express");
const authRouter = require("./routes/auth");
const bookRouter = require("./routes/book");
const userRouter = require("./routes/user");

const PORT = process.env.PORT || 8080;


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to assignment I")
})
app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/books", bookRouter);

app.listen(PORT, console.log(`Server is running on port ${PORT}`))