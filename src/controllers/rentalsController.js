import { connection } from "../dbStrategy/postgres.js";

export async function getRentals(req, res) {
  const customerId = parseInt(req.query.customerId);
  const gameId = parseInt(req.query.gameId);

  try {
    if (customerId) {
      const { rows: rentalsId } = await connection.query(
        `
      WITH game_selection AS (SELECT games.id, games.name, games."categoryId", categories.name as categoryName FROM games JOIN categories ON games."categoryId" = categories.id), customers_selection AS (SELECT customers.id, customers.name FROM customers)
     SELECT rentals.*, row_to_json(customers_selection.*) as customer, row_to_json(game_selection.*) as game FROM rentals INNER JOIN customers_selection ON customers_selection.id = rentals."customerId" INNER JOIN game_selection ON game_selection.id = rentals."gameId" WHERE rentals."customerId" = $1
      `,
        [customerId]
      );
      res.send(rentalsId);
      return;
    }
    if (gameId) {
      const { rows: rentalsId } = await connection.query(
        `
      WITH game_selection AS (SELECT games.id, games.name, games."categoryId", categories.name as categoryName FROM games JOIN categories ON games."categoryId" = categories.id), customers_selection AS (SELECT customers.id, customers.name FROM customers)
     SELECT rentals.*, row_to_json(customers_selection.*) as customer, row_to_json(game_selection.*) as game FROM rentals INNER JOIN customers_selection ON customers_selection.id = rentals."customerId" INNER JOIN game_selection ON game_selection.id = rentals."gameId" WHERE rentals."gameId" = $1
      `,
        [gameId]
      );
      res.send(rentalsId);
      return;
    }

    const { rows: rentals } = await connection.query(`
      WITH game_selection AS (SELECT games.id, games.name, games."categoryId", categories.name as categoryName FROM games JOIN categories ON games."categoryId" = categories.id), customers_selection AS (SELECT customers.id, customers.name FROM customers)
     SELECT rentals.*, row_to_json(customers_selection.*) as customer, row_to_json(game_selection.*) as game FROM rentals INNER JOIN customers_selection ON customers_selection.id = rentals."customerId" INNER JOIN game_selection ON game_selection.id = rentals."gameId"
      `);
    res.send(rentals);
  } catch {
    res.sendStatus(404);
  }
}

export async function postRentals(req, res) {
  res.sendStatus(500);
}

export async function deleteRentals(req, res) {
  res.sendStatus(500);
}
