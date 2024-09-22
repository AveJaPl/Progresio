type ProgressValue = string | number;

export interface Progress {
    id: string;
    name: string;
    date: string;
    value: ProgressValue;
    parameterId: string;
}