import {
  getRentals,
  postRentals,
  postRentalsReturn,
  deleteRentals,
} from "../controllers/rentalsController.js";
import validateUser from "../middlewares/validateUser.js";
import { Router } from "express";

const router = Router();

router.get("/rentals/:customerId?/:gameId?", getRentals);
router.post("/rentals", postRentals);
router.post("/rentals/:id/return", postRentalsReturn);
router.delete("/rentals/:id", deleteRentals);

export default router;
