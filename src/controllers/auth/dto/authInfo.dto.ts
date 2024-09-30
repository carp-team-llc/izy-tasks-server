
export class UserPagination {
    where: {};
    skip: number;
    take: number;
}

export class UserAuth {
    username: string
    password: string
    email: string
    phone: string
    role: string
    isAdmin: boolean
    taskListId?: any
}

export class UserLogin {
    email: string
    password: string
}