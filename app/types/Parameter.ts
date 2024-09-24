import { BaseParameter } from './BaseParameter';
import { DataEntry } from './DataEntry';


export interface ParameterInput extends BaseParameter {}
export interface Parameter extends BaseParameter {
    id: string;
    dataEntries: DataEntry[];
}

export interface DbParameter extends BaseParameter {
    id: string;
    userId: string;
}

export interface ParameterWithCount extends Parameter {
    dataEntriesCount: number;
}