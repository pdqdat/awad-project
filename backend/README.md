# Express.js Backend for MovieMind

## Tech stack

-   Express.js
-   Clerk SDK
-   Mongoose

## How to run

Configure the environment variables:

```backend/.env.development
PORT=5000
MONGO_URI=
CLERK_SECRET_KEY=
```

Install dependencies:

```bash
npm install
```

Run the server:

```bash
npm start
```

## API

### Movie

#### Get all movies

```http
GET /api/movies
```

#### Get a movie

```http
GET /api/movies/:id
```

| Parameter | Type     | Description            |
| :-------- | :------- | :--------------------- |
| `id`      | `string` | **Required**. Movie ID |

#### Get similar movies

```http
GET /api/movies/:id/similar
```

| Parameter | Type     | Description            |
| :-------- | :------- | :--------------------- |
| `id`      | `string` | **Required**. Movie ID |

#### Get trending movies

```http
GET /api/movies/trending/:timeWindow?page=:page&limit=:limit
```

| Parameter    | Type     | Description                                 |
| :----------- | :------- | :------------------------------------------ |
| `timeWindow` | `string` | **Required**. Time window: `day` or `week`. |
| `page`       | `number` | Page number.                                |
| `limit`      | `number` | Number of movies per page.                  |

### Cast

#### Get a cast

```http
GET /api/cast/:id
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `id`      | `string` | **Required**. Cast ID |
