import { ENV } from "@/lib/constants/config";

const route = (path: string) => {
  path = `${ENV.baseURL}${path}`;
  const template = path;
  const create = (obj: any = {}) => {
    let result = template;
    if (!obj) return result;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // @ts-ignore
        result = result.replace(`:${key}`, obj[key]);
      }
    }
    return result;
  };
  return { template, create };
};

export const API_ROUTES = {
  verify_email: route("/verify_email?e=:email&u=:uuid"),
  forgot_password: route("/reset_password?e=:email&u=:uuid"),
};
