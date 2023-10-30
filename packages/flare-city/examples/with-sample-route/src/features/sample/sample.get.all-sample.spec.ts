import { WorkerTest } from "@flare-city/test";
import { expect, test, describe } from "vitest";
import type { GetAllSampleApiResponse } from "./sample.get.all-sample";

describe("GET /sample", () => {
  let worker: WorkerTest;

  test("Should respond with a hello test", async () => {
    worker = new WorkerTest(global.worker);
    const res = await worker.get<GetAllSampleApiResponse>({
      endpoint: "/sample",
    });
    expect(res.json).toMatchObject<GetAllSampleApiResponse>({
      data: { message: "Hello Test" },
    });
  });

  test("should result in an authentication error", async () => {
    const res = await worker.get<GetAllSampleApiResponse>({
      endpoint: "/sample",
    });
    expect(res.raw_response.status).toEqual(401);
  });
});
