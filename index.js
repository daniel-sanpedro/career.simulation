const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const db = require("./db");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

// Create Product table if it doesn't exist
const createProductTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price DECIMAL NOT NULL,
      description TEXT NOT NULL,
      stock INTEGER NOT NULL
    );
  `;
  await db.query(queryText);
};

// Initialize database
createProductTable().catch((err) =>
  console.error("Error creating product table:", err)
);

// CRUD operations
app.get("/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/products", async (req, res) => {
  const { name, price, description, stock } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO products (name, price, description, stock) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, price, description, stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;
  try {
    const result = await db.query(
      "UPDATE products SET name = $1, price = $2, description = $3, stock = $4 WHERE id = $5 RETURNING *",
      [name, price, description, stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM products WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
