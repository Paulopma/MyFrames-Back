import { v4 } from "uuid";

export abstract class IdGenerator {
  public static generate(): string {
    return v4();
  }
}
