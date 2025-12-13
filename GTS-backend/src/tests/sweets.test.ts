import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Sweet } from "../models/Sweets";

let mongod: MongoMemoryServer;

describe("Sweet Model", () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  it("should create a sweet successfully with all required fields", async () => {
    const sweet = await Sweet.create({
      name: "Chocolate Truffle",
      category: "chocolate",
      price: 120,
      quantity: 25,
      description: "Rich dark chocolate truffle with ganache filling",
      imageUrl: "https://example.com/truffle.jpg",
    });

    expect(sweet._id).toBeDefined();
    expect(sweet.name).toBe("Chocolate Truffle");
    expect(sweet.category).toBe("chocolate");
    expect(sweet.price).toBe(120);
    expect(sweet.quantity).toBe(25);
    expect(sweet.description).toContain("truffle");
    expect(sweet.imageUrl).toContain("example");
    expect(sweet.createdAt).toBeInstanceOf(Date);
  });

  it("should throw validation error if required fields are missing", async () => {
    try {
      await Sweet.create({ name: "Unnamed" }); // missing category, price, quantity
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.errors.category).toBeDefined();
      expect(err.errors.price).toBeDefined();
      expect(err.errors.quantity).toBeDefined();
    }
  });

  it("should reject invalid category values", async () => {
    try {
      await Sweet.create({
        name: "Mystery Sweet",
        category: "invalid-category", // not in enum
        price: 10,
        quantity: 5,
      });
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.errors.category).toBeDefined();
      expect(err.errors.category.message).toContain("`invalid-category`");
    }
  });

  it("should not allow negative price or quantity", async () => {
    try {
      await Sweet.create({
        name: "Gummy Bear",
        category: "gummy",
        price: -10,
        quantity: -5,
      });
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.errors.price.message).toContain("negative");
      expect(err.errors.quantity.message).toContain("negative");
    }
  });

  it("should allow creation with only required fields", async () => {
    const sweet = await Sweet.create({
      name: "Caramel Chew",
      category: "caramel",
      price: 50,
      quantity: 10,
    });

    expect(sweet._id).toBeDefined();
    expect(sweet.description).toBeUndefined();
    expect(sweet.imageUrl).toBeUndefined();
  });
});
