import { connection } from "../dbStrategy/postgres.js";

export async function getCategories(req, res) {
  try {
    const { rows: categories } = await connection.query(
      "SELECT * FROM categories"
    );
    res.send(categories);
  } catch {
    res.sendStatus(404);
  }
}

export async function postCategories(req, res) {
  const { name } = req.body;

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);
    res.sendStatus(201);
  } catch {
    res.sendStatus(406);
  }
}
