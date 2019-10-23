import { ResolveTime } from "@/lib/middleware/resolve_time";

describe("resolve_time", () => {

    const timeout = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    test("displays resolver run times", async () => {
        // arrange
        const action: any = {
            info: {
                parentType: {
                    name: "Name"
                },
                fieldName: "FieldName"
            }
        };
        const next = async () => await timeout(5);

        // act
        const {
            resolveTime,
            message
        } = await ResolveTime(action, next);

        // assert
        expect(resolveTime).toBeGreaterThan(5);
        expect(message).toMatch(/Name\.FieldName \[\d+ ms]/);
    });
});
