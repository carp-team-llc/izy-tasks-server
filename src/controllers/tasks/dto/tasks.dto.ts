export class tasks {
    id?: string
    name: string
    body: string
    status: string
    statusColor: string
    statusName: string
    author: string
    expirationDate: Date
    isExpiration: boolean
    images: string[]
    tags?: string[]
    project?: string
    team?: string
    employee?: string
}

export class tasksVariables {
    where: {}
    skip: number
    take: number
}