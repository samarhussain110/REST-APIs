
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/recipes")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.log("MongoDB Connection Error:", error));

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  ingredients: {
    type: [String],
    default: []
  },
  instructions: {
    type: String
  },
  cuisine: {
    type: String
  },
  cookingTime: {
    type: Number
  },
  servings: {
    type: Number
  },
  difficulty: {
    type: String
  },
  category: {
    type: String
  }
});

// Recipe Model
const Recipe = mongoose.model("Recipe", recipeSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("Recipe Management API is Running");
});

// GET All Recipes
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Single Recipe
app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ message: "Invalid recipe ID" });
  }
});

// POST Create Recipe
app.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();

    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST Bulk Insert Recipes
app.post("/recipes/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of recipes"
      });
    }

    const recipes = await Recipe.insertMany(req.body);

    res.status(201).json({
      message: "Recipes added successfully",
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT Update Recipe
app.put("/recipes/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE Recipe
app.delete("/recipes/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({
      message: "Recipe deleted successfully",
      data: deletedRecipe
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid recipe ID" });
  }
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
