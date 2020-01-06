import getConfig from "next/config";
import fetch from "isomorphic-unfetch";

const { publicRuntimeConfig } = getConfig();

const client = async (url: string, { body, ...customConfig }: RequestInit = {}) => {
  // const token = getAccessToken();
  const headers: HeadersInit = {
    "content-type": "application/json",
  };
  // @TODO add back token header to client
  // if (token) {
  //   headers.Authorization = token.authorizationString;
  // }
  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
  if (!isValidUrl(url)) {
    url = `${publicRuntimeConfig.API_URL}${url}`;
  }
  const response = await fetch(url, config);
  return await response.json();
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export default client;
