import nodemailer from "nodemailer"; //enviar correos
import crypto from "crypto"; //Generar códigos aleatorios
import jsonwebtoken from "jsonwebtoken"; //Generar token
import bcryptjs from "bcryptjs"; //Encriptar contraseña

import studentsModel from "../models/Students.js";

import { config } from "../config.js";
import { format } from "path";
import { transcode } from "buffer";
import customers from "../models/customers.js";

//Array de funciones
const RegisterStudentsController ={};


RegisterStudentsController.register = async(req,res) => {
    try {
        //#1 solicitar todos los datos a guardar
        let {Name,lastName,email,password,career,isVerified,loginAttempts,timeout} = req.body;

        //Verificamos si el correo ya esta registrado
        const existStudents = await studentsModel.findOne({email})

        if(existStudents){
            return res.status(400).json({message:"email alredy in use"});
        }

        //Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10);

        const newStudent = new studentsModel({
            Name,
            lastName,
            email,
            password: passwordHash,
            career,
            isVerified: isVerified || false,
            loginAttempts,
            timeout
        });

        await newStudent.save();


        const verficationCode = crypto.randomBytes(3).toString("hex");

        //Guardamos el codigo Aleatorio
        const tokenCode = jsonwebtoken.sign(
            {email,verficationCode},
            config.JWT.secret,
            {expiresIn: "15m"},
        );

        //
        res.cookie("verificationTokenCookie", tokenCode,{
            maxAge: 15 * 60 * 1000
        });

        //Transporter --> a quien se le envia el correo
        const Transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:config.email.user_email,
                pass:config.email.user_password,
            },
        });

        //quien lo va a recibir?
        const mailOptions = {
            from: config.email.user_email,
            to:email,
            subject:"verificacion de la Cuenta",
            text:
                "Para  verificar tu cuenta, utiliza este código: " +
                verficationCode +
                " expira en 15 minutos",
        };

        //enviar el Correo Electronico 
        Transporter.sendMail(mailOptions, (error,info) => {
            if(error){
                console.log("error" + error);
                return res.status(500).json({message: "error"});
            }

            return res.status(200).json({message:"email send"});
        });

    }catch (error) {
        consol.log("error" + error)
        return res.status(500).json({message:"Internal Server Error"})
    }
};



RegisterStudentsController.VerifyCode = async(req,res) => {
    try {
        //Solicitamos el codigo de Verficacion
        const {verficationCode} = req.body;


        //Obtener el Token de la cookie
        const token = req.cookies.verficationCode;

        //Extraer la informacion del token
        const decoded = jsonwebtoken.verify(token,config.JWT.secret);
        const {email, verficationCode : storedCode} = decoded;

        //validar el Token
        if(verficationCode !== storedCode){
            return res.status(400).json({message:"Invalid Code"});
        }

        //Si el codigo esta bien
        const student = await studentsModel.findOne({email});
        student.isVerified = true;
        await student.save();

        res.clearCookie("verficationCode");

        res.json({message:"Email verified Succesfully"})

    } catch (error) {
        console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
    }
}


export default RegisterStudentsController;