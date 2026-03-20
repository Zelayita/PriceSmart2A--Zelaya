//array de funciones
const brandController = {};

//importo la colección que voy a ocupar
import brandsModel from "../models/brands.js";

//SELECT
brandController.getBrand = async (req, res) => {
  try {
    const brands = await brandsModel.find();
    return res.status(200).json(brands);
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERTAR
brandController.insertBrands = async (req, res) => {
  try {
    //#1- solicito los datos a guardar
    let { name, slogan, address, isActive } = req.body;

    //#2- Validaciones
    //sanitizar
    name = name?.trim();
    slogan = slogan?.trim();
    address = address?.trim();

    //validaciones de datos null o require
    if (!name || !slogan || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //validacion de tamaño
    if (name.length < 3) {
      return res.status(400).json({ message: "name too short" });
    }

    if (address.length > 100) {
      return res.status(400).json({ message: "address too long" });
    }

    //Guardo en la base de datos
    const newBrand = new brandsModel({ name, slogan, address, isActive });
    await newBrand.save();

    return res.status(201).json({ message: "Brand saved" });
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ELIMINAR
brandController.deleteBrand = async (req, res) => {
  try {
    const deleteBrand = await brandsModel.findByIdAndDelete(req.params.id);

    //Validación por si no fue borrada la marca
    if (!deleteBrand) {
      return res.status(404).json({ message: "brand not found" });
    }

    return res.status(200).json({ message: "brand deleted" });
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ACTUALIZAR
brandController.updateBrand = async (req, res) => {
  try {
    //Pedimos los nuevos datos
    let { name, slogan, address, isActive } = req.body;
    //#2- Validaciones
    //sanitizar
    name = name?.trim();
    slogan = slogan?.trim();
    address = address?.trim();

    //validacion de tamaño
    if (name.length < 3) {
      return res.status(400).json({ message: "name too short" });
    }

    if (address.length > 100) {
      return res.status(400).json({ message: "address too long" });
    }

    //actualizamos
    const updatedBrands = await brandsModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slogan,
        address,
        isActive,
      },
      { new: true },
    );

    //si no se actualiza
    if (!updatedBrands) {
      return res.status(404).json({ mesage: "brand not found" });
    }

    return res.status(200).json({ message: "brand updated" });
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default brandController;
