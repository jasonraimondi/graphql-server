let accessToken = "";

export const setAccessToken = (s: string) => {
    console.log("set token", "(", s, ")");
    accessToken = s;
};

export const getAccessToken = () => {
    console.log("get token", "(", accessToken, ")");
    return accessToken;
};
