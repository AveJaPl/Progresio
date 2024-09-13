export interface Progress {
    id: string;
    name: string;
    date: string;
    value: string;
    parameterId: string;
  }
  
  export interface Parameter {
    id: string;
    name: string;
    type: "boolean" | "int" | "float";
    goalOperator: string;
    goalValue: string;
    progress: Progress[];
  }
  