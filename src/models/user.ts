import Client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pepper: string = process.env.BYCRYPT_PEPPER as string;
const saltRounds = parseInt(process.env.SALTROUNDS as string);

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  isadmin?: boolean;
};

export class allUsers {
  static async index() {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`users index cannot be retrieved Error:${err}`);
    }
  }

  static async show(id: number): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`users id:${id} could not be retrieved Error:${err}`);
    }
  }

  static async delete(id: number): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = "DELETE FROM users WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`users id:${id} cannot be deleted Error:${err}`);
    }
  }

  static async update(password: string, username: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = "UPDATE users SET password=($1) WHERE username=($2)";
      const hash = bcrypt.hashSync(password + pepper, saltRounds);
      const result = await conn.query(sql, [hash, username]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `password cannot be changed for username:${username} Error:${err}`
      );
    }
  }

  static async makeUserAdmin(
    isadmin: boolean,
    username: string
  ): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        "UPDATE users SET isadmin=($1) WHERE username=($2) RETURNING *";
      const result = await conn.query(sql, [isadmin, username]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error: ${err}`);
    }
  }
}

export default allUsers;
