import type { ProjectDto } from "src/controllers/projects/dto/Project.dto";

export interface tasks {
    id?: string;
    name: string;
    body: string;
    status: string;
    statusColor: string;
    statusName: string;
    author: string;
    expirationDate: Date;
    isExpiration: boolean;
    images: string[];
    tags?: string[];
    projectId?: string;
    project?: ProjectDto;
    team?: string;
    employee?: string;
}

export class tasksVariables {
    where: {}
    skip: number
    take: number
}

export class History {
    taskId: string;
    action: string;
    changes: object;
    createdAt: Date;
    task: any;
}