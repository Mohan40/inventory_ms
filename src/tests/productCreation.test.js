//File for unit test scripts

const app = require("../../app");
const request = require("supertest");
const {insert} = require("mongoose");

describe("POST /product/createproduct", () => {
  let connection;
  let db;
  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });
  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  test("(Correct input) Should respond with a 200 status code.", async () => {
    /*const products = db.collection("products");

    const mockProduct = {
      _id: "some-product-id",
      productName: "Mi Camera 8",
      productSpecifications: {
        Processor: "Core V2",
      },
      productPrice: 3200.0,
      productQuantity: 3,
      deliveryChannel: "air",
    };
    await products.insertOne(mockProduct);

    const insertedProduct = await products.findOne({ _id: "some-user-id" });
    expect(insertedProduct).toEqual(mockProduct);

*/

    const response = await request(app)
      .post("/product/createproduct")
      .set("Accept", "application/json")
      .set(
        "Cookie",
        "connect.sid=s%3A1c23538a-9266-4366-9563-19af3b9106d0.4RXnd3ZQfaUL%2BVoSoCkZPckRsRK4J0Rn4jfBF%2Bshc5A"
      )
      .send({
        productName: "Mi Camera 8",
        productSpecifications: {
          Processor: "Core V2",
        },
        productPrice: 3200.0,
        productQuantity: 3,
        deliveryChannel: "air",
      });
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
    except(response.toBe);
  });
});
