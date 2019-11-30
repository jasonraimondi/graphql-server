let inMemoryRefreshToken = "";

export const setRefreshToken = (token: string) => {
    inMemoryRefreshToken = token;
};

export const getRefreshToken = () => {
    return inMemoryRefreshToken;
};
