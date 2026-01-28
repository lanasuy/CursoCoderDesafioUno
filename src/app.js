import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
const PORT = 8080;

app.use(express.json());

const productManager = new ProductManager("./data/products.json");
const cartManager = new CartManager("./data/carts.json");

//PRODUCTOS

// GET /api/products - Para obtener todos los productos
app.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// GET /api/products/:pid - Para obtener un producto por su ID
app.get("/api/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado o fuera de stock" });
  }

  res.json(product);
});

// POST /api/products - Para agregar un nuevo producto
app.post("/api/products", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// PUT /api/products/:pid - Para actualizar un producto por su ID
app.put("/api/products/:pid", async (req, res) => {
  const updatedProduct = await productManager.updateProduct(
    req.params.pid,
    req.body
  );

  if (!updatedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(updatedProduct);
});

// DELETE /api/products/:pid - Para eliminar un producto por su ID
app.delete("/api/products/:pid", async (req, res) => {
  await productManager.deleteProduct(req.params.pid);
  res.json({ message: "Producto eliminado" });
});

//CARRITOS

// POST /api/carts - Para crear un nuevo carrito
app.post("/api/carts", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

// GET /api/carts/:cid - Para obtener un carrito por su ID
app.get("/api/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid - Para agregr un producto a un carrito
app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cart = await cartManager.addProductToCart(
    req.params.cid,
    req.params.pid
  );

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
