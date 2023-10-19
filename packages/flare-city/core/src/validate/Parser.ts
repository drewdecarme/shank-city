import { z, ZodNumber, ZodString, ZodEnum } from "zod";

export type ParserSchemas = ZodString | ZodNumber | ZodEnum<[any, ...any[]]>;

export class Parser {
  #fieldName: string;
  schema: ParserSchemas;

  constructor(fieldName: string) {
    this.#fieldName = fieldName;
    this.schema = z.coerce.string();
  }

  asString() {
    this.schema = z.coerce.string();
    return this.schema;
  }
  asNumber() {
    this.schema = z.coerce.number();
    this.schema.refine((value) => !isNaN(value), {
      message: "Cannot convert into a number",
    });
    return this.schema;
  }
  asArray<T extends string>(values: T[]) {
    // @ts-ignore
    this.schema = z.array<T>([values]);
    return this.schema;
  }

  get property() {
    return this.#fieldName;
  }
}

export function parse(fieldName: string) {
  return new Parser(fieldName);
}
