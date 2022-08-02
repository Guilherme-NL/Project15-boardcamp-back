import {
  getCategories,
  postCategories,
} from "../controllers/categoriesController.js";
import validateUser from "../middlewares/validateUser.js";
import { Router } from "express";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", postCategories);

export default router;
