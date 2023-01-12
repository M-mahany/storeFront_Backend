import express, { Request, Response } from "express";
import Productstore, { Product } from "../models/product";
import { verifyTokenAndAuthorization } from "../middleware/jsonWebToken";

// GET all products from db
const showAll = async (_req: Request, res: Response) => {
  try {
    const users = await Productstore.index();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};
// GET product from db by id
const showById = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productid as string);
  try {
    const product = await Productstore.show(productId);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

// DELETE product from db by id
const deleteProductById = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productid as string);
  try {
    const product = await Productstore.delete(productId);
    res.status(200).json(`product ${product} has been deleted successfuly`);
  } catch (err) {
    res.status(400).json(err);
  }
};
//UPDATE product price
const updatedProduct = async (req: Request, res: Response) => {
  const price = parseInt(req.body.price as string);
  const prodcut_name = req.body.product_name as string;
  try {
    await Productstore.update(price, prodcut_name);
    res
      .status(200)
      .json(`product: ${prodcut_name} has been updated successfuly`);
  } catch (err) {
    res.status(400).json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      product_name: req.body.product_name,
      price: req.body.price,
      category: req.body.category,
    };
    const newProduct = await Productstore.create(product);
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

const product_Routes = (app: express.Application) => {
  app.get("/products", showAll);
  app.get("/products/:productid", showById);
  app.delete(
    "/users/:userid/products/:productid",
    verifyTokenAndAuthorization,
    deleteProductById
  );
  app.post("/users/:userid/products", verifyTokenAndAuthorization, create);
  app.put(
    "/users/:userid/products",
    verifyTokenAndAuthorization,
    updatedProduct
  );
};
export default product_Routes;
