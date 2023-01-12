import Client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "./user";

dotenv.config();

const pepper: string = process.env.BYCRYPT_PEPPER as string;
const saltRounds = parseInt(process.env.SALTROUNDS as string);

export class userAuth {
  static async create(u: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO users(first_name, last_name, username, password) VALUES($1, $2, $3, $4) RETURNING *";
      const hash = bcrypt.hashSync(u.password + pepper, saltRounds);

      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hash,
      ]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`could not create username: ${u.username} Error: ${err}`);
    }
  }

  static async login(username: string, password: string): Promise<User | null> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users WHERE username=($1)";
      const result = await conn.query(sql, [username]);
      const user = result.rows[0];
      if (user.password !== undefined) {
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`username was not found error: ${err}`);
    }
  }
}

export default userAuth;
