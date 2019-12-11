import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";

import { buildSchema } from "type-graphql";
import { join } from "path";

const projectRoot = join(__dirname, "../../../");
const resolvers = join(projectRoot, "packages/api/src/modules/**/*_resolver.ts");
const outputSchema = join(projectRoot, "packages/web/.schema.graphql");

console.log("source: ", resolvers);
console.log("output: ", outputSchema);

(async () => {
  await buildSchema({
    resolvers: [resolvers],
    emitSchemaFile: {
      path: outputSchema,
      commentDescriptions: true,
    },
  });
})();
