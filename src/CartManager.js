//Imports
import fs from "fs";
import crypto from "crypto";

//Defino la clase CartManager y le paso la ruta del archivo json al constructor
export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    if (!fs.existsSync(this.path)) return []; //Verifico si el archivo existe
    const data = await fs.promises.readFile(this.path, "utf-8"); //leo el archivo
    return JSON.parse(data); //parseo el contenido y lo devuelvo
  }

  async getCartById(id) { //obtiene todos los carritos y busca el que coincida con el id recibido por parámetro
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  async createCart() { //Crea un nuevo carrito
    const carts = await this.getCarts(); //obtengo la lista actual de carritos

    const newCart = {
      id: crypto.randomUUID(),
      products: []
    };

    carts.push(newCart); 
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2)); //guardo el carrito en el archivo JSON 
    return newCart;
  }

  async addProductToCart(cartId, productId) { //Agrega un producto a un carrito
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cartId);

    if (!cart) return null; //si no existe el carrito, devuelve null

    const productInCart = cart.products.find( //busco si el producto ya está en el carrito
      p => p.product === productId 
    );

    if (productInCart) { //si el producto ya está en el carrito, incremento la cantidad
      productInCart.quantity += 1;
    } else {
      cart.products.push({ //si no está, lo agrego con cantidad 1
        product: productId,
        quantity: 1
      });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2)); //guardo los cambios
    return cart;
  }
}
