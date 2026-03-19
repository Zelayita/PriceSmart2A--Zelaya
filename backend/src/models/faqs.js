/*
Campos
    question
    answer
    isActive
*/


import { Schema,model } from "mongoose";

const faqsSchema = new Schema({
    question: {
        type: String
    },
    answer: {
        type: String
    },
    isActive:{
        type: Boolean
    }
}, {timestamps: true, 
    strict: false}
)

export default model("faqs", faqsSchema)