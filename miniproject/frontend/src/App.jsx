import { useState, useEffect } from "react";
import "./App.css";

const emptyForm = {
    name: "",
    category: "",
    price: "",
    stock: ""
};

function App() {
    const [form, setForm] = useState(emptyForm);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadProducts() {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/products?search=${encodeURIComponent(search)}`,
                    { signal: controller.signal }
                );
                if (!response.ok) {
                    throw new Error(`Product request failed with status ${response.status}`);
                }
                setProducts(await response.json());
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching products:", error);
                }
            }
        }

        loadProducts();
        return () => controller.abort();
    }, [search]);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function addProduct() {
        if (!form.name || !form.category || !form.price || !form.stock) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    category: form.category,
                    price: Number(form.price),
                    stock: Number(form.stock)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Error adding product");
                return;
            }

            setProducts((prev) => [...prev, data]);
            setForm(emptyForm);
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to connect to server");
        }
    }

    async function deleteProduct(productId) {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setProducts((prev) => prev.filter((product) => product.id !== productId));
            } else {
                alert("Error deleting product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to connect to server");
        }
    }

    const totalItems = products.reduce((sum, product) => sum + product.stock, 0);
    const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const lowStock = products.filter((product) => product.stock <= 5).length;

    return (
        <div className="app-shell">
            <header className="topbar">
                <div>
                    <p className="eyebrow">Business dashboard</p>
                    <h1>Inventory Manager</h1>
                </div>
            </header>

            <div className="summary-grid">
                <div className="summary-card accent-blue">
                    <span>Total Products</span>
                    <strong>{products.length}</strong>
                </div>
                <div className="summary-card accent-green">
                    <span>Units in Stock</span>
                    <strong>{totalItems}</strong>
                </div>
                <div className="summary-card accent-orange">
                    <span>Inventory Value</span>
                    <strong>${totalValue.toFixed(2)}</strong>
                </div>
                <div className="summary-card accent-red">
                    <span>Low Stock</span>
                    <strong>{lowStock}</strong>
                </div>
            </div>

            <div className="content-grid">
                <section className="panel form-panel">
                    <h2>Add Product</h2>
                    <div className="form-grid">
                        <input
                            type="text"
                            name="name"
                            placeholder="Product name"
                            value={form.name}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={form.category}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            min="0"
                            step="1"
                            value={form.stock}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="add-btn" onClick={addProduct}>Add Product</button>
                </section>

                <section className="panel table-panel">
                    <h2>Inventory List</h2>
                    <input
                        className="search-box"
                        type="text"
                        placeholder="Search by product or category..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>${product.price.toFixed(2)}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteProduct(product.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {products.length === 0 && <p className="empty-state">No products found.</p>}
                </section>
            </div>
        </div>
    );
}

export default App;