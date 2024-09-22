import { Progress } from './Progress';

export interface Parameter {
    id: string;
    name: string;
    type: string;
    goalOperator: string;
    goalValue: string;
    progress: Progress[];
}

export interface IDbParameter {
    id: string;
    name: string;
    type: string;
    goalOperator: string;
    goalValue: string;
    userId: string;
}

export interface IParameter {
    name: string;
    type: string;
    goalOperator: string;
    goalValue: string;
}