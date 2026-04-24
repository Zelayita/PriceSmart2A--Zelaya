import bcrypt from "bcryptjs";
import jsonwebtoken from 'jsonwebtoken';

import customerModel from "../models/customers.js"

import {config} from "../config.js"


const loginCustomerController = {};

loginCustomerController.Login = async(req,res) =>{ 
    try {
        //Solicitar el Correo y la Contraseña
        const {email,password} = req.body

        //Verificar si el correo existe en la BD
        const userfound = await customerModel.findOne({email})

        //Si no lo encuentra
        if(!userfound){
            return res.status(404).json({message:"Customer not Found"});
        }

        //Verificar siu la cuenta esta bloqueada
        if(userfound.timeOut && userfound.timeOut > Date.now){
            return res.status(403).json({message: "Cuenta Bloqueada"})
        }

        //Verificar Contraseña
        const isMatch = await bcrypt.compare(password, userfound.password);

        if(!isMatch){
            //Si se equivoca en la contraseña
            //Vamos a sumarle 1 a los intentos fallidos
            userfound.loginAttempts = (userfound.loginAttempts || 0) + 1

            //Bloquear la Cuenta despues de 5 Intentos fallidos
            if(userfound.loginAttempts >= 5){
                userfound.timeOut= Date.now() + 15 * 60 * 1000;
                userfound.loginAttempts = 0;

                await userfound.save();
                return res.status(403).json({message: "Cuenta Bloqueada"})
            }

            await userfound.save();
            return res.status(403).json({message:"Contraseña Incorrecta"})

        }

        userfound.loginAttempts = 0;
        userfound.timeOut = null
        await userfound.save();

        const token = jsonwebtoken.sign(
        //# 1 - Payload (Datos que quiero guardar en el Token)
        {id: userfound._id, 
        userType : "customer"},
        //#2 - Clave Secreta para Firmar el Token
        config.JWT.secret,  
        //#3 - Opciones del Token (Tiempo de Expiración)
        {expiresIn: "30d"},
        );
        
        //gUARDAMOS EL TOKEN EN UNA COOKIE
        res.cookie("authCookie", token);

        //Listo
        return res.status(200).json({messgae:"Login exitoso"})

    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message:"Internal server Error" + error})
    }
};

export default loginCustomerController;