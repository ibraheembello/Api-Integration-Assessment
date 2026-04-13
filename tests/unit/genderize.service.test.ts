import nock from "nock";
import { GenderizeService } from "../../src/services/genderize.service";
import { config } from "../../src/config";
import { NotFoundError, UpstreamError } from "../../src/errors/app.error";

describe("GenderizeService", () => {
  let service: GenderizeService;

  beforeEach(() => {
    service = new GenderizeService();
    nock.cleanAll();
  });

  it("should successfully classify a name", async () => {
    const name = "Peter";
    nock(config.genderizeApiUrl)
      .get("/")
      .query({ name })
      .reply(200, {
        count: 150,
        name: "Peter",
        gender: "male",
        probability: 0.99,
      });

    const result = await service.classifyName(name);

    expect(result.name).toBe("Peter");
    expect(result.gender).toBe("male");
    expect(result.is_confident).toBe(true);
  });

  it("should throw NotFoundError when no prediction is available", async () => {
    const name = "InvalidName";
    nock(config.genderizeApiUrl)
      .get("/")
      .query({ name })
      .reply(200, {
        count: 0,
        name: "InvalidName",
        gender: null,
        probability: 0,
      });

    await expect(service.classifyName(name)).rejects.toThrow(NotFoundError);
  });

  it("should throw UpstreamError when external API fails", async () => {
    const name = "Peter";
    nock(config.genderizeApiUrl)
      .get("/")
      .query({ name })
      .reply(500);

    await expect(service.classifyName(name)).rejects.toThrow(UpstreamError);
  });

  it("should use cache for repeated calls", async () => {
    const name = "Peter";
    const scope = nock(config.genderizeApiUrl)
      .get("/")
      .query({ name })
      .once() // Only once!
      .reply(200, {
        count: 150,
        name: "Peter",
        gender: "male",
        probability: 0.99,
      });

    await service.classifyName(name);
    await service.classifyName(name);

    expect(scope.isDone()).toBe(true);
  });
});
