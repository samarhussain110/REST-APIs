const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Connection
mongoose.connect("mongodb://localhost:27017/books")
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("Failed:", error);
    });

// Schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    price: Number
});

// Model
const Book = mongoose.model("Book", bookSchema);

// GET BOOKS
app.get("/books", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

// ADD BOOK
app.post("/books", async (req, res) => {
    const book = await Book.create(
        req.body
    );

    res.json(book);
});

// UPDATE BOOK
app.put("/books/:id", async (req, res) => {
    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedBook);
});

// DELETE BOOK
app.delete("/books/:id", async (req, res) => {
    const deletedBook = await Book.findByIdAndDelete(
        req.params.id
    );

    res.json(deletedBook);
});

// Listening
app.listen(3000, () => {
    console.log("App is listening on port 3000");
});