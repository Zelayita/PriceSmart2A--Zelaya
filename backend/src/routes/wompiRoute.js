import wompiController from "../controllers/WompiController.js";
import e from "express";

const router = e.Router()

router.route("/token").post(wompiController.generarToken)
router.route("/paymentTest").post(wompiController.paymentTest)
router.route("/payment3ds").post(wompiController.payment3ds)

export default router;