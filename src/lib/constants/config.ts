export const ENV = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "",
    enableDebugging: !!process.env.ENABLE_DEBUGGING,
    cors: (process.env.CORS || "").split(","),
    mailerURL: process.env.MAILER,
};
