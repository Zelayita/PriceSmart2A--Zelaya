//Creo un array de métodos
const productController = {};

//Import del Schema de la colección
//que vamos a ocupar
import productsModel from "../models/products.js";

//SELECT
productController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

//INSERTAR
productController.insertProducts = async (req, res) => {
  //#1- Solicitamos los campos
  const { name, description, price, stock } = req.body;

  const newProduct = new productsModel({ name, description, price, stock });

  await newProduct.save();

  res.json({ message: "Product save" });
};

//ELIMINAR
productController.deleteProducts = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "product deleted" });
};

//ACTUALIZAR
productController.updateProducts = async (req, res) => {
  //1- solicitamos los nuevos valores
  const { name, description, price, stock } = req.body;
  await productsModel.findByIdAndUpdate(req.params.id, {
    name, 
    description, 
    price, 
    stock}, {new: true})

    res.json({message: "product updated"})

};

export default productController;