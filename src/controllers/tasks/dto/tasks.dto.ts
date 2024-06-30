export class tasks {
    name: string
    body: string
    status: string
    statusColor: string
    statusName: string
    author: string
    createdAt: Date
    updatedAt: Date
    expirationDate: Date
    isExpiration: boolean
    images: string[]
    tags: string[]
    project: string
    team: string
}

export class tasksVariables {
    where: {}
    skip: number
    take: number
}