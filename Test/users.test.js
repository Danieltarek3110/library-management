const request = require("supertest");
const app = require("../server/app");
const userModel = require("../src/Model/user");

describe("GET /api/v1/admin/users/:id", () => {
  it("should return user details when valid user ID is provided", async () => {
    const userId = "2";
    const expectedUser = {
      id: 2,
      name: "Daniel",
      email: "DanielTarek@gmail.com",
      password: "$2b$08$DC4EkbZygp.fBosTK3yRrOLzQcKQMzFbQw.KZGlJXsOpO8LSsAXWK",
    };

    userModel.getUserByID = jest.fn().mockResolvedValueOnce([expectedUser]);

    const response = await request(app)
      .get(`/api/v1/admin/users/${userId}`)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIsImlhdCI6MTcxMTgwNTg3NX0.W0NtXHkiSI9Go0xQ7CdDmBH2lmEtTINfnnM-Ygdf3Lc"
      );

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedUser);
  });

  it("should return 404 if user ID does not exist", async () => {
    const userId = "999";

    userModel.getUserByID = jest.fn().mockResolvedValueOnce([]);

    const response = await request(app)
      .get(`/api/v1/admin/users/${userId}`)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIsImlhdCI6MTcxMTgwNTg3NX0.W0NtXHkiSI9Go0xQ7CdDmBH2lmEtTINfnnM-Ygdf3Lc"
      );

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User id not found");
  });
});
