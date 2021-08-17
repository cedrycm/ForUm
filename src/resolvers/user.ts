import { Resolver, Arg, Ctx, Mutation, InputType, Field, ObjectType } from "type-graphql";
import { User } from "../entities/User";
import { MyContext} from "../types";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string
}

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
  
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput, 
    @Ctx() { em, req}: MyContext
  ): Promise<UserResponse>{

    if(options.username.length <= 2 ) {
      return {
        errors: [{
          field: "username",
          message: "length must be greater than 2",
        },
      ],
      };
    }

    if(options.password.length <= 3 ) {
      return {
        errors: [{
          field: "username",
          message: "length must be greater than 3",
        },
      ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    
    let user;

    try{
      const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert(
        {
          username: options.username,
          password: hashedPassword,
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
    @Arg("options") options: UsernamePasswordInput, 
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {username: options.username });
    
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

    const valid = await argon2.verify(user.password, options.password);
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
}

