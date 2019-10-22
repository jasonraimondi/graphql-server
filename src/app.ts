import { InversifyContainer } from "@/lib/inversify_container";
import { InversifyExpressServer } from "inversify-express-utils";
import { expressMiddlewares } from "@/init";

export const application = async (container: InversifyContainer, controllers: string[]) => {
    await asyncForEach(controllers, async (path: string) => await import(path));
    const server = new InversifyExpressServer(container);
    server.setConfig(expressMiddlewares);
    return server.build();
};

async function asyncForEach(array: any[], callback: Function) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
