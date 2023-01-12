import express, { Request, Response } from "express";
import allUsers from "../models/user";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../middleware/jsonWebToken";

// GET all users from db
const showAll = async (_req: Request, res: Response) => {
  try {
    const users = await allUsers.index();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};
// GET user from db by id
const showById = async (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid as string);
  try {
    const user = await allUsers.show(userid);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

// DELETE user from db by id
const deleteUserById = async (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid as string);
  try {
    const user = await allUsers.delete(userid);
    res.status(200).json(`user ${user} has been deleted successfuly`);
  } catch (err) {
    res.status(400).json(err);
  }
};
//UPDATE user password
const updateUser = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await allUsers.update(password, username);
    res.status(200).json(`user ${user} password has been updated successfuly`);
  } catch (err) {
    res.status(400).json(err);
  }
};

const user_Routes = (app: express.Application) => {
  app.get("/users", verifyTokenAndAdmin, showAll);
  app.get("/users/:userid", verifyTokenAndAuthorization, showById);
  app.delete("/users/:userid", verifyTokenAndAuthorization, deleteUserById);
  app.put("/users/", verifyTokenAndAuthorization, updateUser);
};
export default user_Routes;
