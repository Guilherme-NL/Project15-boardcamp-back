import { connection } from "../dbStrategy/postgres.js";
import dayjs from "dayjs";
import joi from "joi";

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
  const { customerId, gameId, daysRented } = req.body;

  const { rows: checkCustomer } = await connection.query(
    "SELECT * FROM customers WHERE id = $1",
    [customerId]
  );
  if (checkCustomer.length < 1) {
    res.sendStatus(400);
    return;
  }

  const { rows: checkGame } = await connection.query(
    "SELECT * FROM games WHERE id = $1",
    [gameId]
  );
  if (checkGame.length < 1) {
    res.sendStatus(400);
    return;
  }

  if (daysRented < 1) {
    res.sendStatus(400);
    return;
  }

  const { rows: checkRentals } = await connection.query(
    'SELECT * FROM rentals WHERE rentals."gameId" = $1',
    [gameId]
  );
  if (checkRentals.length >= checkGame[0].stockTotal) {
    res.sendStatus(400);
    return;
  }
  console.log(checkRentals.length, checkGame[0].stockTotal);

  const returnDate = null;
  const delayFee = null;
  const rentDate = dayjs(new Date(), "YYYY-MM-DD");

  const { rows: gamePrice } = await connection.query(
    'SELECT games."pricePerDay" FROM games WHERE games.id = $1',
    [gameId]
  );
  console.log(gamePrice);
  const originalPrice = gamePrice[0].pricePerDay * daysRented;
  console.log(originalPrice);

  await connection.query(
    'INSERT INTO rentals ("customerId","gameId","rentDate","daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
    ]
  );

  res.sendStatus(201);
}

export async function postRentalsReturn(req, res) {
  const id = parseInt(req.params.id);

  const { rows: rental } = await connection.query(
    "SELECT * FROM rentals WHERE id = $1",
    [id]
  );
  if (rental.length < 1) {
    res.sendStatus(404);
    return;
  }

  if (rental[0].returnDate !== null) {
    res.sendStatus(400);
    return;
  }

  const rentDate = new Date(rental[0].rentDate);
  const returnDate = dayjs(new Date(), "YYYY-MM-DD");
  const daysRented = rental[0].daysRented;
  const pricePerDay = rental[0].originalPrice / rental[0].daysRented;
  const diff = Math.abs(returnDate - rentDate);
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const delayDays = diffDays - daysRented;
  let delayFee = null;

  if (delayDays > 0) {
    delayFee = delayDays * pricePerDay;
  }

  connection.query(
    'UPDATE rentals SET "returnDate"= $1, "delayFee"= $2 WHERE id= $3',
    [returnDate, delayFee, id]
  );

  res.sendStatus(200);
}

export async function deleteRentals(req, res) {
  const id = parseInt(req.params.id);

  const { rows: rental } = await connection.query(
    "SELECT * FROM rentals WHERE id = $1",
    [id]
  );
  if (rental.length < 1) {
    res.sendStatus(404);
    return;
  }

  if (rental[0].returnDate === null) {
    res.sendStatus(400);
    return;
  }

  await connection.query("DELETE FROM rentals WHERE id = $1", [id]);

  res.sendStatus(200);
}
