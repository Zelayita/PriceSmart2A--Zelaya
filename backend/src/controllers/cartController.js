import cartmodel from "../models/cart.js";
import productsmodel from "../models/products.js";

const cartController = {};

cartController.getCart = async (req,res) =>{
    try {
        const carts = await cartmodel.find().populate("customerId", "name email").populate("products.productId", "name")

        return res.status(200).json(carts);
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

//Select by ID
cartController.getCartById = async (req,res) => {
    try {
        const cart = cartmodel.findById(req.params.id).populate("customerId", "name email").populate("products.productId", "name")
        return res.status(200).json(cart)
    } catch (error) {
        console.log("error" ,error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

//Insert
cartController.InsertCart = async (req,res) => {
    try {
        const {customerId,products,status} = req.body;
        //Calcular el Subtotal y Total

        let total = 0;
        let newproduct = [];

        for(let i = 0; i < products.length; i ++){
            const productFound = await productsmodel.findById(products[i].productId);

            //Calcular el subtotal
            const subtotal = productFound.price * products[i].quantity;

            //Calcular el total
            total += subtotal

            //Guardar el producto junto con la cantidad y el total
            newproduct.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                subtotal: subtotal
            })

        }

        //Guardarlos en la base de datos
        const newcart = new cartmodel({
            customerId,
            products:newproduct,
            total,
            status
        })

        await newcart.save()

        return res.status(200).json({message:"Cart Saved"})

    } catch (error) {
        console.log("error" ,error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

//UPDATE
cartController.updateCart = async (req, res) =>{
    try {
        //Datos para actualizar
        const {customerId, products, status} = req.body;
 
        //CALCULO DE SUBTOTALES Y TOTALS
        let total = 0;
 
        let newProducts = []
        for(let i = 0 ; i < products.length; i++){
            //Buscamos el producto
            const productFound = await productsmodel.findById(products[i].productId)
            //Calculamos el subtotal
            const subtotal = productFound.price * products[i].quantity;
            //Calculamos el total
            total += subtotal
            //Guardamos cada objeto en el array
            newProducts.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                subtotal: subtotal
            })
        }
 
        //Actualizamos en la base de datos
        const updatedCart = await cartModel.findByIdAndUpdate(
            req.params.id,
            {
                customerId,
                products: newProducts,
                total,
                status
            }, {new: true}
        )
 
 
    } catch (error) {
        console.log("error" ,error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

//Eliminar
cartController.deleteCart = async (req,res) =>{
    try {
        
        const deleteCart = await cartmodel.findByIdAndDelete(req.params.id);

        if(!deleteCart){
            return res.status(404).json({message:"Cart not found"});
        }

        return res.status(200).json({message:"Cart deleted"})


    } catch (error) {
        console.log("error" ,error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}
 
export default cartController;