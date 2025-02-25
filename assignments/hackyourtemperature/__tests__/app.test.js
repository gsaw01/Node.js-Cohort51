import { app } from "../app.js"; 
import supertest from "supertest";

const request = supertest(app);

describe("POST /weather", () => {
  it("should return weather if cityName is provided", async () => {
    const cityName = "Amsterdam";

    const response = await request
      .post("/weather")
      .send({ cityName });

    expect(response.status).toBe(200);
    expect(response.body.weatherText).toContain("Temperature in Amsterdam");
  });

  it("should return error if cityName isn't provided", async () => {
    const response = await request
      .post("/weather")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("cityName is required");
  });

  it("should return error if city is not found", async () => {
    const cityName = "Balaboobooboo";

    const response = await request
      .post("/weather")
      .send({ cityName });

    expect(response.status).toBe(200);
    expect(response.body.weatherText).toBe("City not found!");
  });
});