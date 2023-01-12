import Client from "../database";

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export type productOrders = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class Orders {
  static async index() {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`orders index cannot be retrieved Error:${err}`);
    }
  }

  static async show(id: number) {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`product id:${id} could not be retrieved Error:${err}`);
    }
  }

  static async delete(id: number, user_id: number): Promise<Order | null> {
    try {
      const conn = await Client.connect();
      const presql = "SELECT * FROM orders WHERE id=($1) AND user_id=($2)";
      const preresult = await conn.query(presql, [id, user_id]);

      if (preresult.rows.length) {
        const sql = "DELETE FROM orders WHERE id=($1) AND user_id=($2)";
        const result = await conn.query(sql, [id, user_id]);
        const user = result.rows[0];
        return user;
      }
      return null;
    } catch (err) {
      throw new Error(`you are not authorized ${err}`);
    }
  }

  static async update(status: string, id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = "UPDATE orders SET status=($1) WHERE id=($2)";
      const result = await conn.query(sql, [status, id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`staus cannot be changed for orderID:${id} Error:${err}`);
    }
  }

  static async create(o: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO orders(user_id, status) VALUES($1, $2) RETURNING *";
      const result = await conn.query(sql, [o.user_id, o.status]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`could not create orderid: ${o.user_id} Error: ${err}`);
    }
  }
  static async addProductToOrder(po: productOrders): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO product_order(order_id, product_id, quantity) VALUES($1, $2, $3)";
      const result = await conn.query(sql, [
        po.order_id,
        po.product_id,
        po.quantity,
      ]);
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `could not add productid:${po.product_id} to order ${po.order_id}Error: ${err}`
      );
    }
  }

  static async checkOrderStatus(id: number): Promise<Order | null> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      if (result.rows.length) {
        const status = result.rows[0];
        return status;
      }
      return null;
    } catch (err) {
      throw new Error(`unable to process request Error: ${err}`);
    }
  }
}

export default Orders;
