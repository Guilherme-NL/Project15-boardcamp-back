import { getGames, postGames } from "../controllers/gamesController.js";
import validateUser from "../middlewares/validateUser.js";
import { Router } from "express";

const router = Router();

router.get("/games", getGames);
router.post("/games", postGames);

export default router;
