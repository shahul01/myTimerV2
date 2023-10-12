# Timer app

## Built with Electron, React & tRPC.

### TechStacks

- Electron
- React
  - Hooks - useState, useEffect, useImperative
- React Query
- TypeScript
- Zod
- CSS in modules
- tRPC
- SQLite
- Prisma

<br /> <hr /> <br />

### Screenshots

#### home

![home.png](./assets/images/screenshots/home.png)

<br /> <hr /> <br />

### Flow charts

#### 1. State changes

![myTimer-updates](./assets/images/flowCharts/myTimer-updates.drawio.png)

<br /> <hr /> <br />

### codes

#### 1. to start

```
  # frontend and backend
  npm i --save-exact
  npm run postinstall
  npm run start

  # db
  npx prisma generate
  npx prisma db push
  npm run dev:server

```

#### 2. misc

#### 2a. prisma schema update

```
  npx prisma migrate dev --create-only
  npx prisma migrate dev
```

#### refer todo for reference docs

### credits

#### electron - react template

[electron-react-boilerplate repo](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

<br /> <hr /> <br />
