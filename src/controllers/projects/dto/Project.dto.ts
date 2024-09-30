
export interface Variables {
  where: {};
  skip: number;
  take: number;
}

export interface ProjectMemberDTO {
  userId?: string;
  projectId?: string;
  role?: string;
  roleName?: string;
  roleEngName?: string;
  permission?: string;
}

export interface ProjectDto {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  member?: ProjectMemberDTO[];
  tasks?: string[];
  avatar?: string;
  deadline: Date;
  timeworking?: string;
  permission?: object[];
}
