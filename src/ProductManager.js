//Imports
import fs from "fs";
import crypto from "crypto";

//Defino la clase ProductManager y le paso la ruta del archivo json al constructor
export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    if (!fs.existsSync(this.path)) return []; //Verifico si el archivo existe
    const data = await fs.promises.readFile(this.path, "utf-8"); //leo el archivo
    return JSON.parse(data); //parseo el contenido y lo devuelvo
  }

  async getProductById(id) { //Este método obtiene todos los productos y luego busca el que coincida con el id recibido por parámetro
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts(); //obtengo el listado actual de productos

    const newProduct = { //Creo un nuevo objeto producto. El id se genera automáticamente con randomUUID y el resto de los campos vienen del body
      id: crypto.randomUUID(),
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails || []
    };

    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); //Agrego el producto al arreglo y sobrescribo el archivo JSON con la lista actualizada
    return newProduct;
  }

  async updateProduct(id, fields) { //Actualiza un producto por ID
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return null;

    products[index] = { //Actualizo solo los campos recibidos en el body
      ...products[index],
      ...fields,
      id: products[index].id
    };

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); //guardo los cambios
    return products[index];
  }

  async deleteProduct(id) { //para borrar un producto por ID
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    await fs.promises.writeFile(this.path, JSON.stringify(filtered, null, 2));
  }
}
