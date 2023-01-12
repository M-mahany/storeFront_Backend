import Client from "../database";

export type Product = {
  id?: number;
  product_name: string;
  price: number;
  category: string;
};

export class Productstore {
  static async index() {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM product";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`product index cannot be retrieved Error:${err}`);
    }
  }

  static async show(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM product WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`product id:${id} could not be retrieved Error:${err}`);
    }
  }

  static async delete(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = "DELETE FROM product WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`product id:${id} cannot be deleted Error:${err}`);
    }
  }

  static async update(price: number, prodcut_name: string): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = "UPDATE product SET price=($1) WHERE product_name=($2)";
      const result = await conn.query(sql, [price, prodcut_name]);
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `price cannot be changed for product:${prodcut_name} Error:${err}`
      );
    }
  }

  static async create(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO product(product_name, price, category) VALUES($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [
        p.product_name,
        p.price,
        p.category,
      ]);
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `could not create productname: ${p.product_name} Error: ${err}`
      );
    }
  }
}

export default Productstore;
