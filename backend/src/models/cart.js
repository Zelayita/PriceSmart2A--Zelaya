/**
 * campos:
 *  customerId
 *  products:
 *      customerId,
 *      quantity,
 *      subtotal
 *  total,
 *  status
 */

import mongoose, { Schema, model} from "mongoose";

const CartSchema = new Schema({
    customerId:{type: mongoose.Schema.Types.ObjectId, ref: "Customers"},
    products:[
        {
            productId:{type: mongoose.Schema.Types.ObjectId, ref: "Products"},
            quantity:{type: Number},
            subtotal:{type: Number}
        }
    ],
    total:{type: Number},
    status:{type: String}
},{
    timestamps:true,
    strict:false
});

export default model("Cart", CartSchema)