import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyTokenAndAuthorization = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token: string | undefined = authorizationHeader?.split(
      " "
    )[1] as string;
    const decoded = jwt.verify(token, process.env.TOKEN_SEC as string);
    //I have used any here because decoded will not access id without <any> as done below
    if ((<any>decoded).user.id !== parseInt(req.params.userid)) {
      throw new Error("User id does not match!");
    }
    next();
  } catch (err) {
    res.status(401).json(`access denied Invalid token Error:${err}`);
  }
};

export const verifyTokenAndAdmin = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token: string | undefined = authorizationHeader?.split(
      " "
    )[1] as string;
    const decoded = jwt.verify(token, process.env.TOKEN_SEC as string);
    //I have used any here because decoded will not be access id without <any> as done below
    if ((<any>decoded).user.isadmin) {
      next();
    } else {
      throw new Error("Your accound is not admin");
    }
  } catch (err) {
    res.status(401).json(`access denied Invalid token Error:${err}`);
  }
};

export default { verifyTokenAndAuthorization, verifyTokenAndAdmin };
