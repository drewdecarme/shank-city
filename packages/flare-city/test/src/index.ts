import { RequestURLSearchParams } from "@flare-city/core";

export class WorkerTest {
  #worker: typeof global.worker;

  constructor(worker: typeof global.worker) {
    this.#worker = worker;
  }

  private paramsToString(params: RequestURLSearchParams | undefined) {
    if (!params) return "";
    const paramsObj = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value.toString()])
    );
    const searchParamString = new URLSearchParams(paramsObj).toString();
    return `?${searchParamString}`;
  }

  private getWorker() {
    if (!this.#worker) throw "Cannot find worker on global scope";
    return this.#worker;
  }

  async get<R, P extends RequestURLSearchParams = RequestURLSearchParams>({
    endpoint,
    params,
    requestInit,
  }: {
    endpoint: string;
    params?: P;
    requestInit?: RequestInit;
  }): Promise<{ json: R; raw_response: Response }> {
    const search = this.paramsToString(params);
    const url = endpoint.concat(search);
    const worker = this.getWorker();
    try {
      /**
       * RATIONALE: RequestInit_2 is not exported. However
       * it is the same Api as the RequestInit
       */
      // @ts-ignore
      const response = await worker.fetch(url, requestInit);
      const json = (await response.json()) as R;
      /**
       * RATIONALE: Same as above but with Response_2
       */
      // @ts-ignore
      return { json, raw_response: response };
    } catch (error) {
      throw error;
    }
  }
}
