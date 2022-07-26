import { connection } from "../dbStrategy/postgres.js";
import joi from "joi";

export async function getCustomers(req, res) {
  const cpf = parseInt(req.query.cpf);
  const id = parseInt(req.params.id);
  console.log(id);

  try {
    if (cpf) {
      const { rows: cpfCustomers } = await connection.query(
        "SELECT * FROM customers WHERE cpf LIKE $1",
        [cpf + "%"]
      );
      res.send(cpfCustomers);
      return;
    }
    if (id) {
      const { rows: idCustomers } = await connection.query(
        "SELECT * FROM customers WHERE id = $1",
        [id]
      );

      if (!idCustomers) {
        res.sendStatus(404);
        return;
      }

      res.send(idCustomers);
      return;
    }

    const { rows: customers } = await connection.query(
      "SELECT * FROM customers"
    );
    res.send(customers);
  } catch {
    res.sendStatus(404);
  }
}

export async function postCustomers(req, res) {
  const customer = req.body;

  const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi
      .string()
      .pattern(/^[0-9]+$/)
      .min(10)
      .max(11)
      .required(),
    cpf: joi
      .string()
      .pattern(/^[0-9]+$/)
      .max(11)
      .min(11)
      .required(),
    birthday: joi.date().required(),
  });

  const { error } = customerSchema.validate(customer);
  if (error) {
    res.sendStatus(400);
    return;
  }

  const { rows: checkCpf } = await connection.query(
    "SELECT * FROM customers WHERE cpf = $1",
    [customer.cpf]
  );
  console.log(checkCpf);
  if (checkCpf.length > 0) {
    res.sendStatus(409);
    return;
  }

  await connection.query(
    'INSERT INTO customers ("name","phone","cpf","birthday") VALUES ($1, $2, $3, $4)',
    [customer.name, customer.phone, customer.cpf, customer.birthday]
  );

  res.sendStatus(201);
}

export async function putCustomers(req, res) {
  const id = parseInt(req.params.id);
  const customer = req.body;

  const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi
      .string()
      .pattern(/^[0-9]+$/)
      .min(10)
      .max(11)
      .required(),
    cpf: joi
      .string()
      .pattern(/^[0-9]+$/)
      .max(11)
      .min(11)
      .required(),
    birthday: joi.date().required(),
  });

  const { error } = customerSchema.validate(customer);
  if (error) {
    res.sendStatus(400);
    return;
  }

  const { rows: checkCpf } = await connection.query(
    "SELECT * FROM customers WHERE cpf = $1",
    [customer.cpf]
  );
  console.log(checkCpf);
  if (checkCpf.length > 0) {
    res.sendStatus(409);
    return;
  }

  await connection.query(
    "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
    [customer.name, customer.phone, customer.cpf, customer.birthday, id]
  );
  res.sendStatus(200);
}
