export const mockRequest = (authHeader?: string, sessionData?: any) => ({
    get(name: string) {
        if (name === "authorization") return authHeader;
        return null;
    },
    cookie: jest.fn().mockReturnValue({
        authorization: "bearer iamacookie"
    }),
    session: { data: sessionData },
});

export const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
