export enum StatusEnum {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}
export type Task = {
  id:number;
  title: string;
  description?: string;
  status: StatusEnum;
  dueDate: Date;
}; 