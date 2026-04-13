import request from "supertest";
import nock from "nock";
import app from "../../src/index";
import { config } from "../../src/config";

describe("GET /api/classify", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it("should return 200 and classification data for a valid name", async () => {
    const name = "Alice";
    nock(config.genderizeApiUrl)
      .get("/")
      .query({ name })
      .reply(200, {
        count: 100,
        name: "Alice",
        gender: "female",
        probability: 0.98,
      });

    const response = await request(app).get(`/api/classify?name=${name}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.name).toBe("Alice");
    expect(response.body.data.gender).toBe("female");
  });

  it("should return 400 for missing name parameter", async () => {
    const response = await request(app).get("/api/classify");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing or empty name parameter");
  });

  it("should return 400 for empty name parameter", async () => {
    const response = await request(app).get("/api/classify?name=");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing or empty name parameter");
  });

  it("should return 422 for invalid name parameter (too many names)", async () => {
    // Express parsing ?name=a&name=b as array
    const response = await request(app).get("/api/classify?name=a&name=b");
    expect(response.status).toBe(422);
  });

  it("should return 404 when no prediction is available", async () => {
    const name = "NonExistentName";
    nock(config.genderizeApiUrl)
      .get("/")
      .query({ name })
      .reply(200, {
        count: 0,
        name: "NonExistentName",
        gender: null,
        probability: 0,
      });

    const response = await request(app).get(`/api/classify?name=${name}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No prediction available for the provided name");
  });

  it("should return 502 for upstream failure", async () => {
    const name = "Peter";
    nock(config.genderizeApiUrl)
      .get("/")
      .query({ name })
      .reply(500);

    const response = await request(app).get(`/api/classify?name=${name}`);
    expect(response.status).toBe(502);
  });
});
