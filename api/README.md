# Okibro API

The server side of the site for learning English with AI.

## Installation

Use Node.js (^18.0.0), npm (^8.0.0) and Docker.

1. Install packages with the following command. It is important command, because application will not work with file-type library with version more than 16:

```
npm ci
```

2. Ask me about env.txt file and rename it to .env and save in the api folder.

3. Now lets create database. Run this command to run database:

```
docker-compose up -d
```

Run migrations:

```
npm run db:migrate
```

Run seeds:

```
npm run db:run:seeds
```

4. Run:

```
npm run dev
```

## Prisma

- Show prisma:

```
npm run show:prisma
```

- Create migration:

```
npx prisma migrate dev --name name_migration
```

- Reset database:

```
npx prisma migrate reset
```

## Testing

1. Up test database:

```
docker-compose up
```

2. Run migrations:

```
npx dotenv -e .env.test -- npm run db:migrate
```

3. Run seeds:

```
npx dotenv -e .env.test -- npm run db:run:seeds
```

4. Run application with test database. However now you can't run all files.
   So you need to run only 1 test file every day. Use -p flag for it.

```
NODE_ENV=test npm run test:watch -p "file_name"
```

- Show prisma:

```
npx dotenv -e .env.test -- npm run show:prisma
```

- Reset test database:

```
npx dotenv -e .env.test -- npx prisma migrate reset
```

## Develop notes

lesson structures:

- infinity-conversation-lesson
- universal-expressions
- phrasal-verbs-lesson
- wise-proverbs-lesson

lesson-status:

- introduction
- conversation
- reviewing
- summarizing

prompts:

- infinity-conversation
- grammar-errors-reviewing
- phrasal-verbs-conversation
- summarize-infinity-conversation
