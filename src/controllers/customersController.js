import { connection } from "../dbStrategy/postgres.js";
import joi from "joi";

export async function getCustomers(req, res) {
  const cpf = parseInt(req.params.cpf);
  try {
    if (cpf) {
      const { rows: cpfCustomers } = await connection.query(
        "SELECT * FROM customers WHERE cpf LIKE $1",
        [cpf + "%"]
      );
      res.send(cpfCustomers);
    } else {
      const { rows: customers } = await connection.query(
        "SELECT * FROM customers"
      );
      res.send(customers);
    }
  } catch {
    res.sendStatus(404);
  }
}

export async function postCustomers(req, res) {
  res.sendStatus(500);
}

export async function putCustomers(req, res) {
  res.sendStatus(500);
}
