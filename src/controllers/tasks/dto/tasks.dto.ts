import type { ProjectDto } from "src/controllers/projects/dto/Project.dto";

export class tasks {
    id?: string;
    name: string;
    body: string;
    status: string;
    statusColor: string;
    statusName: string;
    createdAt?: string;
    startTime: Date;
    expirationDate: Date;
    isExpiration: boolean;
    images: string[];
    tags?: string[];
    projectId?: string;
    team?: string;
    taskListId?: string;
    priority?: string;
    priorityName?: string;
    progress?: number;
    employee?: any;
    author?: any;
    estimatetime?: string;
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