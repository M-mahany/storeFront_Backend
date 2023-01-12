import supertest from "supertest";
import app from "../server";
import userAuth from "../models/auth";
import allUsers from "../models/user";
import { User } from "../models/user";

const request = supertest(app);
describe("test main auth models functions", () => {
  const user: User = {
    first_name: "admin",
    last_name: "admin",
    username: "adminuser",
    password: "123456",
    isadmin: true,
  };
  it("testing creating new user model and make it admin", async () => {
    const createdUserResponse = await userAuth.create(user);
    const userAdmin = await allUsers.makeUserAdmin(
      user.isadmin as boolean,
      user.username
    );
    expect(createdUserResponse.username).toEqual(user.username);
    expect(userAdmin.isadmin).toBeTrue();
  });

  it("testing login model with the same user created", async () => {
    const logedUser = await userAuth.login(user.username, user.password);
    expect(logedUser?.last_name).toBe("admin");
  });

  it("testing Index model", async () => {
    const indexUser = await allUsers.index();
    expect(indexUser).toBeDefined();
  });

  it("testing show user by id model", async () => {
    const user = await allUsers.show(1);
    expect(user?.first_name).toBe("admin");
  });
});

describe("testing main auth routes handler path", () => {
  let usertoken: string;
  let admintoken: string;
  it("testing register Route to create new user not admin", async () => {
    const response = await request.post("/auth/register").send({
      first_name: "mena",
      last_name: "mahany",
      username: "mmahany",
      password: "123456",
    });
    expect(response.status).toBe(200);
  });
  it("testing login route", async () => {
    await request
      .get("/auth/login")
      .send({
        username: "mmahany",
        password: "123456",
      })
      .expect(200)
      .expect((response) => {
        usertoken = response.body;
      });
  });

  it("testing login route with admin", async () => {
    await request
      .get("/auth/login")
      .send({
        username: "adminuser",
        password: "123456",
      })
      .expect(200)
      .expect((response) => {
        admintoken = response.body;
      });
  });

  it("testing Index user route with admin user", async () => {
    await request
      .get("/users")
      .auth(admintoken, { type: "bearer" })
      .expect(200);
  });

  it("testing show user by id with not admin user", async () => {
    console.log(usertoken);
    await request
      .get("/users/2")
      .auth(usertoken, { type: "bearer" })
      .expect(200);
  });
});
