import { Resolver, Arg, Ctx, Mutation, Field, ObjectType, Query } from "type-graphql";
import { User } from "../entities/User";
import { MyContext} from "../types";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

@ObjectType()
class FieldError {
  @Field()
  field:string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable:true})
  errors?: FieldError[];

  @Field(() => User, {nullable:true})
  user?: User;
}

@ObjectType()
class EmailResponse {
  @Field(() => [FieldError], {nullable:true})
  errors?: FieldError[];

  @Field(() => Boolean)
  emailSent: Boolean;
}

@Resolver()
export class UserResolver {
  @Mutation(() => EmailResponse)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx(){ em, redis }: MyContext
  ){
    const user = await em.findOne(User, { email });
    
    console.log(email)
    console.log(user)
    if(!user){
      //error no such user email exists
      //return invalid message 
      return {
        errors: [
          {
            field: "email",
            message: "no users found",
          },
        ],
        emailSent: false,
      };
    }

    const token = v4();

    redis.set(
      FORGET_PASSWORD_PREFIX + token, 
      user.id,
      'ex', 
      1000 * 60 * 60 * 24 * 3 // 3 days expiration
    );
    
    console.log({tokenkey: token});
    await sendEmail(email, 
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
      );

    return { emailSent: true};
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { req, em, redis } : MyContext): Promise<UserResponse>
    {
      if(newPassword.length <= 3 ) {
        return { 
          errors: [
            {
              field: "newPassword",
              message: "length must be greater than 3",
            },
          ],
        };
      }
      const tokenKey = FORGET_PASSWORD_PREFIX + token;
      const userId = await redis.get(tokenKey);
      if(!userId) {
        return {
          errors: [
            {
              field: "token",
              message: "token expired",
            },
          ],
        };
      }
    
      const user = await em.findOne(User, { id: parseInt(userId) }); 

      if(!user){
        return {
          errors: [
            {
              field: "token",
              message: "user no longer exists",
            },
          ],
        };
      }

      user.password = await argon2.hash(newPassword);
    
      await em.persistAndFlush(user);

      await redis.del(tokenKey)
      req.session.UserID = user.id;

      return { user };
    }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    // you are not logged in
    if (!req.session.UserID) {
      return null;
    }
    // const user = await em.findOne(User,{id: req.session.UserID});
    // if(!user){
    //   return {
    //     errors: [
    //       {
    //         field: "session-id",
    //         message: "The session is no longer valid. Please log in again."
    //       },
    //     ],
    //   };
    // }
    // console.log(user)
    return await em.findOne(User,{id: req.session.UserID});
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput, 
    @Ctx() { em, req}: MyContext
  ): Promise<UserResponse>{
    //validateRegister util checks for correct registry inputs 
    const errors = validateRegister(options);
    
    if (errors){
      return {errors};
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          email: options.email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      user = result[0];
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }


    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.UserID = user.id;

    return {user};
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string, 
    @Arg("password") password: string, 
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, usernameOrEmail.includes('@') ? {email: usernameOrEmail } 
    : {username: usernameOrEmail}
    );

    if(!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if(!valid){
      return {
        errors: [
          {
            field: "password",
            message: "the password does not match"
          },
        ],
      };
    }

    //store user id session
    //will set a cookie oon the user 
    //keep them logged in 
    req.session.UserID = user.id;
    return {user,};
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }

        resolve(true)
      })
    );
  }
}
