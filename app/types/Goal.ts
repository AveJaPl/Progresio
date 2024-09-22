// app/types/Goal.ts

export interface IGoal {
    id: string;
    title: string;
    status: string;
    deadline: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type GoalFormData = {
    title: string;
    status: string;
    deadline: Date;
    description?: string;
  };
  export type GoalFormEditData = {
    title: string;
    deadline: Date;
    description?: string;
  };
  