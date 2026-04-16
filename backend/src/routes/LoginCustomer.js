import express from "express";
import loginCustomerController from "../controllers/loginCustomer.js";


const router = express.Router();

router.route("/").post(loginCustomerController.Login);

export default router;