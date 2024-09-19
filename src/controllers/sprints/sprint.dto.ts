
export interface SprintDTO {
  id: string;
  name: string;
  effectiveDate: Date;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  tasks? : string[];
}