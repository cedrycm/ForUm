import { Resolver, Arg, Ctx, Mutation, Field, ObjectType, Query } from "type-graphql";
import { User } from "../entities/User";
import { MyContext} from "../types";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";

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

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    //@Ctx(){req}: MyContext
  ){
    //const user = await email.findOne(User, {email})
    return email;
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

    try{
      const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert(
        {
          username: options.username,
          password: hashedPassword,
          email: options.email,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
        user = result[0];
    } catch(err){
      // console.log('message: ', err.message)
      if(err.detail.includes("already exists")) {
        return {
         errors: [
           {
           field:"username",
           message:"username already taken",
         }, 
         ],
      };
    }
  }  

    req.session.UserID = user.id;

    return {user,};
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
            field: "username",
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
            field: "username",
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
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true)
      })
    );
  }
}
