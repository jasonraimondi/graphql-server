import { v4 } from "uuid";

export abstract class BaseEntity {
  id: string;

  protected constructor(id?: string) {
    this.id = id ?? v4();
  }
}
