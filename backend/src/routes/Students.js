import express from "express";
import RegisterStudentsController from "../controllers/StudentsController";

const router = express.Router();

router.route("/")
.post(RegisterStudentsController.register);
router.route("/verifyCodeEmail").post(RegisterStudentsController.VerifyCode);

export default router;
