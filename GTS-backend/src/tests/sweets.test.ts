import { Sweet } from "../models/Sweets"; 


describe("Sweet Model", () => {
 

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
    await expect(Sweet.create({ name: "Unnamed" })).rejects.toThrow();
  });

  it("should reject invalid category values", async () => {
    await expect(
      Sweet.create({
        name: "Mystery Sweet",
        category: "invalid-category",
        price: 10,
        quantity: 5,
      })
    ).rejects.toThrow();
  });

  it("should not allow negative price or quantity", async () => {
    await expect(
      Sweet.create({
        name: "Gummy Bear",
        category: "gummy",
        price: -10,
        quantity: -5,
      })
    ).rejects.toThrow();
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
