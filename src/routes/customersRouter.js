import {
  getCustomers,
  postCustomers,
  putCustomers,
} from "../controllers/customersController.js";
import validateUser from "../middlewares/validateUser.js";
import { Router } from "express";

const router = Router();

router.get("/customers/:id?/:cpf?", getCustomers);
router.post("/customers", postCustomers);
router.put("/customers/:id", putCustomers);

export default router;
