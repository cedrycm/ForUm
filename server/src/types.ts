import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createVouchLoader } from "./utils/createVouchLoader";

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { UserID: number };
  };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  vouchLoader: ReturnType<typeof createVouchLoader>;
};
