// types/BaseParameter.ts

export type ParameterType = 'number' | 'string' | 'boolean';
export type GoalOperator = '=' | '>' | '<' | '>=' | '<=';

export interface BaseParameter {
  name: string;
  type: ParameterType;
  goalOperator: GoalOperator;
  goalValue: string;
}
