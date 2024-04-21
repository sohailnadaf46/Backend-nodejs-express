// routes are basically some function whenever that URL hits it it does some functions as intentded those are routes

import { Router } from "express";
import { registerUser } from "../../controllers/user.controller.js";


const router = Router();

router.route("/register").post(registerUser)

export default router;