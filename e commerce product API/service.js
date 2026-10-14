const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Connection
mongoose.connect("mongodb://localhost:27017/products")
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("Failed:", error);
    });

// Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    category: String,
    description: String
});
//model
const Product = mongoose.model("Product", productSchema);

//get all products
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

//add a product
app.post("/products", async (req, res) => {
    const product=await Product.create(req.body);
    res.json(product);
});
//update a product
app.put("/products/:id", async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(product);
});

//delete a product
app.delete("/products/:id", async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
});

//  route handler to your backend code
app.delete('/products', async (req, res) => {
    try {
        // This removes all documents from the collection
        const result = await Product.deleteMany({}); 
        res.status(200).json({ 
            message: "All products deleted successfully!", 
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting data", error });
    }
});

//listening
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});