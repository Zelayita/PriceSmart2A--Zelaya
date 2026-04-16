import nodemailer from "nodemailer"
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcrypt from "bcryptjs"
 
import customerModel from "../models/customers.js"
import { config } from "../config.js"
import { text } from "stream/consumers"
 
const registerCustomerController = {};
 
registerCustomerController.register = async (req, res) => {
 
    try {
        //Solicitamos datos
        let {
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttempts,
            timeOut
        } = req.body
 
        //Verificamos si el correo ya existe y esta siendo usado por otro cliente
        const emailExist = await customerModel.findOne({ email })
 
        if (emailExist) {
            return res.status(400).json({ status: "Error", message: "The email is already in use." })
        }
 
        //Encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10)
 
        //Guardamos todo en la base de datos
        const newCustomer = new customerModel({
            name,
            lastName,
            birthdate,
            email,
            password: passwordHash,
            isVerified: isVerified || false,
            loginAttempts,
            timeOut
        })
 
        await newCustomer.save()
 
 
        //Generamos el código aleatorio para verificar que el usuario si es el dueño del correo
        const verificationCode = crypto.randomBytes(3).toString("hex")
 
        //Guardamos este código en un token
        const tokenCode = jsonwebtoken.sign(
            //#1 - PASO 1 PARA CREAR UN TOKEN
            { email, verificationCode },
            //#2 - SECRET KEY
            config.JWT.secret,
            //#3 - ¿Cuando expira
            { expiresIn: "15 min" }
        );
 
        res.cookie("verificationTokenCookie", tokenCode, {maxAge : 15 * 60 * 1000})
 
        //ENVIAR CORREO CON EL CODIGO PARA VERIFICAR
        //#1 - Transporter -> ¿Quién envía el correo?
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.emailUser,
                pass: config.email.emailPass
            }
        })
 
        //#2 - ¿Quién lo va a recibir?
        const mailOptions = {
            from: config.email.emailUser,
            to: email,
            subject: "Verificación de correo",
            text: "Para verificar tu cuenta, utiliza este código: " + verificationCode + "." + " Expira en 15 minutos"
        }
 
        //#3 - Enviar el correo electrónico
        transporter.sendMail(mailOptions, (error, info) =>{
            if(error){
                console.log("error: " + error)
                return res.status(500).json({status: "error", message: error})
            }
 
            res.status(200).json({message: "Email sent"})
        });
 
    } catch (error) {
        console.log("Error: " + error)
        return res.status(500).json({status: "Internal Server Error", message: error})
    }
}
 
registerCustomerController.verifyCode = async (req, res) => {
    try{
        //Solicitamos el código que el usuario recibió
        const {verificationCodeRequest} = req.body;
 
        //#2 Obtenemos el token de la cookie
        const token = req.cookies.verificationTokenCookie
 
        //#3  Extraer la información del token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const {email, verificationCode: storedCode} = decoded;
 
        //#4 Compro el token que el usuario escribió en el frontend
        //con el que esta guardando en el token
        if(verificationCodeRequest !== storedCode){
            return res.status(400).json({status: "error", message: "Invalid code"})
        }
 
        //Si el código si esta bien, entonces colocamos el campo "isVerified" en true
        const customer = await customerModel.findOne({email});
        customer.isVerified = true;
        await customer.save();
 
        res.clearCookie("verificationTokenCookie")
 
        res.json({message: "The email has been verified succesfully"})
    }
    catch(e){
        console.log("Error: " + e)
        return res.status(500).json({status: "Internal Server Error", message: e})
    }
}
 
export default registerCustomerController;