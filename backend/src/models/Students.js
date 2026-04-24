/**
 * Campos para Estudiantes
 * Name,lastName,email,password,career,isVerified,loginAttempts,timeout
 */

import { Schema,model } from "mongoose";

const StudentsSchema = new Schema({
    name:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    career:{
        type:String
    },
    isVerified:{
        type:String
    },
    loginAttempts:{
        type:String
    },
    timeout:{
        type:String
    }
},{
    timestamps:true,
    strict:false
})

export default model("Students", StudentsSchema)