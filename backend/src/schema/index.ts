import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const typesArray = loadFilesSync(path.join(__dirname, './*.graphql'));
export const typeDefs = mergeTypeDefs(typesArray);