const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let products = [
    { id: 1, name: "Laptop Pro 14", category: "Electronics", price: 999.99, stock: 8 },
    { id: 2, name: "Mechanical Keyboard", category: "Accessories", price: 79.5, stock: 15 },
    { id: 3, name: "Wireless Mouse", category: "Accessories", price: 29.99, stock: 22 },
    { id: 4, name: "Office Chair", category: "Furniture", price: 249.0, stock: 5 }
];

app.get("/", (req, res) => {
    res.send("Inventory Management API is running");
});

app.get("/api/products", (req, res) => {
    try {
        const search = (req.query.search || "").toString().trim().toLowerCase();

        const filteredProducts = products.filter((product) => {
            if (!search) return true;
            return (
                product.name.toLowerCase().includes(search) ||
                product.category.toLowerCase().includes(search)
            );
        });

        res.json(filteredProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

app.post("/api/products", (req, res) => {
    try {
        const { name, category, price, stock } = req.body || {};

        if (!name || !category || price === undefined || stock === undefined) {
            return res.status(400).json({ message: "Name, category, price and stock are required" });
        }

        const parsedPrice = Number(price);
        const parsedStock = Number(stock);

        if (!name.trim() || !category.trim()) {
            return res.status(400).json({ message: "Name and category cannot be empty" });
        }

        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ message: "Price must be a valid positive number" });
        }

        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            return res.status(400).json({ message: "Stock must be a non-negative whole number" });
        }

        const newProduct = {
            id: Date.now(),
            name: name.trim(),
            category: category.trim(),
            price: Number(parsedPrice.toFixed(2)),
            stock: parsedStock
        };

        products.push(newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Error adding product", error: error.message });
    }
});

app.delete("/api/products/:id", (req, res) => {
    try {
        const productId = Number(req.params.id);
        const index = products.findIndex((product) => product.id === productId);

        if (index === -1) {
            return res.status(404).json({ message: "Product not found" });
        }

        const [removedProduct] = products.splice(index, 1);
        res.json({ message: "Product deleted successfully", product: removedProduct });
    } catch (error) {
        res.status(400).json({ message: "Error deleting product" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});