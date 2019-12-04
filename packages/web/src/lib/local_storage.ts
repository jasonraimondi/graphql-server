const storagePrefix = "app.";

export class LocalStorage {
  public static get<T>(key: string): T {
    const item = window.localStorage.getItem(storagePrefix + key);

    if (!item || item === "null") {
      throw new Error("item is invalid");
    }

    return JSON.parse(item);
  }

  public static set(key: string, value: any): void {
    if (value === undefined) {
      value = null;
    } else {
      value = JSON.stringify(value);
    }

    window.localStorage.setItem(storagePrefix + key, value);
  }
}
