import { Progress } from './Progress';

type goalOperator = ">" | "<" | "=" | ">=" | "<=" | "!=";


export interface Parameter {
    id: string;
    name: string;
    type: string;
    goalOperator: goalOperator;
    goalValue: string;
    progress: Progress[];
}

export interface IDbParameter {
    id: string;
    name: string;
    type: string;
    goalOperator: goalOperator;
    goalValue: string;
    userId: string;
}