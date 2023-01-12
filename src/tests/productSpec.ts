import supertest from "supertest";
import Productstore, { Product } from "../models/product";
import app from "../server";

const request = supertest(app);

describe("testing main products routes handler path", () => {
  let admintoken: string;
  it("login to get token and proceed with testing", async () => {
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

  it("testing creating new products route with admin token", async () => {
    await request
      .post("/users/1/products")
      .auth(admintoken, { type: "bearer" })
      .send({
        product_name: "iphone 13",
        price: 30000,
        category: "mobile",
      })

      .expect(200);
  });

  it("testing creating another product route with admin token", async () => {
    await request
      .post("/users/1/products")
      .auth(admintoken, { type: "bearer" })
      .send({
        product_name: "iphone 13 pro max",
        price: 35000,
        category: "mobile",
      })

      .expect(200);
  });
  it("testing indexing product", async () => {
    const response = await request.get("/products");
    expect(response.body).toEqual([
      { id: 1, product_name: "iphone 13", price: 30000, category: "mobile" },
      {
        id: 2,
        product_name: "iphone 13 pro max",
        price: 35000,
        category: "mobile",
      },
    ]);
  });

  it("testing show product by id", async () => {
    const response = await request.get("/products/2");
    expect(response.body).toEqual({
      id: 2,
      product_name: "iphone 13 pro max",
      price: 35000,
      category: "mobile",
    });
  });
});

describe("testing product models", () => {
  const Product: Product = {
    product_name: "iphone 14",
    price: 60000,
    category: "mobile",
  };

  it("testing creating new products model", async () => {
    const response = await Productstore.create(Product);
    expect(response).toBeDefined();
  });

  it("testing indexing product", async () => {
    const response = await Productstore.index();
    expect(response).toEqual([
      { id: 1, product_name: "iphone 13", price: 30000, category: "mobile" },
      {
        id: 2,
        product_name: "iphone 13 pro max",
        price: 35000,
        category: "mobile",
      },
      {
        id: 3,
        product_name: "iphone 14",
        price: 60000,
        category: "mobile",
      },
    ]);
  });

  it("testing show product by id", async () => {
    const response = await Productstore.show(3);
    expect(response).toEqual({
      id: 3,
      product_name: "iphone 14",
      price: 60000,
      category: "mobile",
    });
  });
});
