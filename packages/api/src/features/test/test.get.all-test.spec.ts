import { WorkerTest } from "@flare-city/test";
import { expect, test, describe } from "vitest";
import type { GetAllTestApiResponse } from "./test.get.all-test";

describe("GET /test", () => {
  let worker: WorkerTest;

  test("Should respond with a hello test", async () => {
    worker = new WorkerTest(global.worker);
    const res = await worker.get<GetAllTestApiResponse>({
      endpoint: "/test",
    });
    expect(res.json).toMatchObject<GetAllTestApiResponse>({
      data: { message: "Hello Test" },
    });
  });

  test("should result in an authentication error", async () => {
    const res = await worker.get<GetAllTestApiResponse>({
      endpoint: "/test",
    });
    expect(res.raw_response.status).toEqual(401);
  });
});
