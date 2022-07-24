import { connection } from "../dbStrategy/postgres.js";
import joi from "joi";

export async function getGames(req, res) {
  try {
    const { rows: games } = await connection.query("SELECT * FROM games");
    res.send(games);
  } catch {
    res.sendStatus(404);
  }
}

export async function postGames(req, res) {
  const game = req.body;
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const gameSchema = joi.object({
    name: joi.required(),
    image: joi.required(),
    stockTotal: joi.number().min(1),
    categoryId: joi.required(),
    pricePerDay: joi.number().min(1),
  });

  const { error } = gameSchema.validate(game);
  if (error) {
    res.sendStatus(422);
    return;
  }

  const { rows: checkId } = await connection.query(
    "SELECT * FROM categories WHERE id = $1",
    [game.categoryId]
  );
  console.log(checkId);
  if (checkId === []) {
    res.sendStatus(400);
    return;
  }

  const { rows: checkName } = await connection.query(
    "SELECT * FROM games WHERE name = $1",
    [game.name]
  );
  console.log(checkName);
  if (checkName.length > 0) {
    res.sendStatus(409);
    return;
  }

  try {
    await connection.query(
      `INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );

    res.sendStatus(201);
  } catch {
    res.sendStatus(404);
  }
}
