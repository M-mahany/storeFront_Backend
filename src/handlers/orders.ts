import express, { Request, Response } from "express";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../middleware/jsonWebToken";
import Orders, { Order, productOrders } from "../models/orders";

// GET all orders from db
const showAll = async (_req: Request, res: Response) => {
  try {
    const orders = await Orders.index();
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};
// GET order from db related to userid only
const showById = async (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid as string);
  try {
    const user = await Orders.show(userid);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

// DELETE order from db by id
const deleteOrderbyId = async (req: Request, res: Response) => {
  const orderid = parseInt(req.params.orderid as string);
  const user_id = parseInt(req.params.userid as string);

  const deletedOrder = await Orders.delete(orderid, user_id);
  console.log(deletedOrder);
  if (deletedOrder !== null) {
    res.status(200).json("order has been deleted succesfully");
  } else {
    res.status(400).json("your are not allowed to delete this order id");
  }
};
//UPDATE order status
const updateOrder = async (req: Request, res: Response) => {
  const status = req.body.status;
  const id = parseInt(req.params.orderid as string);
  try {
    await Orders.update(status, id);
    res.status(200).json(`orderid: ${id} status has been updated successfuly`);
  } catch (err) {
    res.status(400).json(err);
  }
};

//Create a new order assigned to user id
const create = async (req: Request, res: Response) => {
  const order: Order = {
    user_id: parseInt(req.params.userid as string),
    status: req.body.status,
  };
  try {
    const newOrder = await Orders.create(order);
    res.status(200).json(newOrder);
  } catch (err) {
    res.status(400).json(`Error :${err}`);
  }
};

//Add order to an existing order if order status is active
const AddProductToOrder = async (req: Request, res: Response) => {
  const productOrder: productOrders = {
    order_id: parseInt(req.params.orderid as string),
    product_id: req.body.product_id,
    quantity: req.body.quantity,
  };
  const orderstatus = await Orders.checkOrderStatus(
    parseInt(req.params.orderid as string)
  );
  if (orderstatus?.status === "active") {
    const newProductToOrder = await Orders.addProductToOrder(productOrder);
    res.status(200).json(newProductToOrder);
  } else {
    res
      .status(400)
      .json("products cannot be added to order because it is completed");
  }
};

const orders_routes = (app: express.Application) => {
  app.get("/orders", verifyTokenAndAdmin, showAll);
  app.get("/users/:userid/orders", verifyTokenAndAuthorization, showById);

  app.delete(
    "/users/:userid/orders/:orderid",
    verifyTokenAndAuthorization,
    deleteOrderbyId
  );
  app.post("/users/:userid/orders", verifyTokenAndAuthorization, create);
  app.put(
    "/users/:userid/orders/:orderid",
    verifyTokenAndAuthorization,
    updateOrder
  );
  app.post(
    "/users/:userid/orders/:orderid",
    verifyTokenAndAuthorization,
    AddProductToOrder
  );
};
export default orders_routes;
