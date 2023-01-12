import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import user_Routes from "./handlers/user";
import user_Auth_Routes from "./handlers/auth";
import product_Routes from "./handlers/product";
import orders_routes from "./handlers/orders";

const app = express();
const port = 7000;

app.use(bodyParser.json());
user_Routes(app);
user_Auth_Routes(app);
product_Routes(app);
orders_routes(app);

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to StoreFront Backend API");
});

app.listen(port, () => {
  console.log(`starting app on: ${port}`);
});

export default app;
