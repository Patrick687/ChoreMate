import path from "path";
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: path.join(__dirname, "../schema/**/*.graphql"),
  generates: {
    [path.join(__dirname, "../generated/graphql-types.ts")]: {
      plugins: ["typescript"]
    }
  }
};

export default config;