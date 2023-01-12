import express, { Request, Response } from "express";
import userAuth from "../models/auth";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// REGISTER to create new user account
const create = async (req: Request, res: Response) => {
  const user: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const newUser = await userAuth.create(user);
    res.status(200).json(newUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

// LOGIN to acces user account
const Login = async (req: Request, res: Response) => {
  const username: string = req.body.username as string;
  const password: string = req.body.password as string;
  const currentUser = await userAuth.login(username, password);
  if (currentUser !== null) {
    const token = jwt.sign(
      {
        user: currentUser,
      },
      process.env.TOKEN_SEC as string
    );
    res.status(200).json(token);
  } else {
    res.status(400).json("Wrong login credential");
  }
};

const user_Auth_Routes = (app: express.Application) => {
  app.post("/auth/register", create);
  app.get("/auth/login", Login);
};
export default user_Auth_Routes;
