let inMemoryAccessToken = "";

export const setAccessToken = (token: string) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => {
  return inMemoryAccessToken;
};
