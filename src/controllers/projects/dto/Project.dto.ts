import type { tasks } from "src/controllers/tasks/dto";

export interface Variables {
  where: {};
  skip: number;
  take: number;
}

export interface ProjectDto {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  member?: string[];
  tasks?: string[];
  avatar?: string;
  deadline: Date;
}