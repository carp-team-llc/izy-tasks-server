# Izy Task API Server

API Server of the task management mobile and web application

## Technologies used:

- Backend: Node.js with Express library.
- Database: MongoDB | SQL Server | Prisma
## Installation Guide

#### Installing Server:

```
git clone https://github.com/carp-calangthang/izy-tasks-server.git
```

#### Installing Nodejs:

- Install Node.js (Application version: 20.11.0) - <a href="https://nodejs.org/en/download/current">Install</a>
- Install required packages: <b>yarn</b> and <b>npm</b>

#### Installing MongoDB:

- Install MongoDB Community Server - <a href="https://www.mongodb.com/try/download/community">Install</a>

- Install MongoDB Compass - <a href="https://www.mongodb.com/try/download/compass">Install</a>

#### Installing Prisma:
#### Using yarn
```
yarn add @prisma/client
```
#### Using npm
```
npm install @prisma/client
```

## Running the server

#### Install all packages
```
yarn
```

#### Running server with development enviroment
```
yarn start:dev
```

#### Running Prisma studio
```
yarn studio
```
## API Reference

### Auth

#### Get all User
```http
  POST /api/v1/auth/users_panigation
```

| Body | Type     | Description                |    Example     |
| :-------- | :------- | :------------------------- | :------------------------- |
| `where` | `obj` | ``Null`` | ``Null`` |
| `take` | `number` | **Required** The number of data items to retrieve per page | ``10`` |
| `skip` | `number` | **Required** It specifies the number of records to skip before starting to retrieve results | ``0`` |

#### Register

```http
  POST /api/v1/auth/register
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Your username |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |
| `phone` | `string` | **Required**. Your phone number |

#### Login

```http
  POST /api/v1/auth/login
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |

### Task

#### Task list

```http
  POST /api/v1/task/tasks_list
```

| Body | Type     | Description                |    Example     |
| :-------- | :------- | :------------------------- | :------------------------- |
| `where` | `obj` | ``Null`` | ``Null`` |
| `take` | `number` | **Required** The number of data items to retrieve per page | ``10`` |
| `skip` | `number` | **Required** It specifies the number of records to skip before starting to retrieve results | ``0`` |

#### Create task

```http
  POST /api/v1/task/create_task
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Task's name |
| `body` | `string` | **Required**. Description |
| `author` | `string` | **Required**. authorId (current user's ID) |
| `expirationDate` | `string` | **Required**. expiration date |
| `isExpiration` | `boolean` | **Required**. `true` or `false` |
| `images` | `array` | **Required**. image urls |
| `tags` | `array` | **Required**. tagsId |
| `projectId` | `string` | **Required**. project id |
| `team` | `string` | **Required**. teamMemberId |
| `employee` | `string` | **Required**. user's ID |
| `priority` | `string` | **Required**. Check {} |

#### update task

```http
  POST /api/v1/task/update_task
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Task's id |
| `name` | `string` | **Required**. Task's name |
| `body` | `string` | **Required**. Description |
| `author` | `string` | **Required**. authorId (current user's ID) |
| `expirationDate` | `string` | **Required**. expiration date |
| `isExpiration` | `boolean` | **Required**. `true` or `false` |
| `images` | `array` | **Required**. image urls |
| `tags` | `array` | **Required**. tagsId |
| `projectId` | `string` | **Required**. project id |
| `team` | `string` | **Required**. teamMemberId |
| `employee` | `string` | **Required**. user's ID |
| `priority` | `string` | **Required**. Check {} |

#### delete task

```http
  POST /api/v1/task/delete_task
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Task's id |

### Task status handle

#### Complete task

```http
  POST /api/v1/task/completed_task
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Task's id |

#### Cancel task

```http
  POST /api/v1/task/cancel_task
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Task's id |

#### Late task

```http
  POST /api/v1/task/late_task
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Task's id |

#### New task

```http
  POST /api/v1/task/new_task
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Task's id |

#### Pending task

```http
  POST /api/v1/task/pending_task
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Task's id |

## Authors

- [@carpthecalangthang](https://github.com/carp-calangthang)
- [@Hxann](https://github.com/hxann)

