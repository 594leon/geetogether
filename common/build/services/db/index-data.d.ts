import { IndexSpecification } from "mongodb";
export interface IndexData {
    collName: string;
    indexName: string;
    index: IndexSpecification;
}
