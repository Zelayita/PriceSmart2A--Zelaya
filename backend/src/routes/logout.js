import express from 'express';
import LogoutController from '../controllers/LogoutController.js';

const router = express.Router();

router.route("/").post(LogoutController.Logout);

export default router;