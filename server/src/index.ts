import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Vouch } from "./entities/Vouch";
import { createUserLoader } from "./utils/createUserLoader";
import { createVouchLoader } from "./utils/createVouchLoader";

//dokku env
//db: forum-db
//redis: foredis
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "redditdb2",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    entities: [Post, User, Vouch],
    migrations: [path.join(__dirname, "./migrations/*")],
  });

  // await conn.runMigrations();
  // await Post.delete({})

  const app = express();

  const RediStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000", //"https://studio.apollographql.com", //
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RediStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      secret: "hehehehehehehe",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      vouchLoader: createVouchLoader(),
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
