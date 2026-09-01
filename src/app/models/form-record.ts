export type Department =
  | 'HR'
  | 'Finance'
  | 'IT'
  | 'Legal';

export interface FormRecord {
  id: string;
  code: string;
  arabicName: string;
  englishName: string;
  department: Department;
  submissionDeadline: string;
  createdAt: string;
}