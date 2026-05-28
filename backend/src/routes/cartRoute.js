import express from 'express';
import cartController from '../controllers/CartController.js';

const router = express.Router();

router.route("/")
.get(cartController.getCart)
.post(cartController.InsertCart);

router.route(":id")
.put(cartController.updateCart)
.delete(cartController.deleteCart)
.get(cartController.getCartById)

export default router;