import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Vouch } from "../entities/Vouch";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @FieldResolver(() => String)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(@Root() post: Post, @Ctx() { req, vouchLoader }: MyContext) {
    if (!req.session.UserID) {
      return null;
    }
    const vouch = await vouchLoader.load({
      postId: post.id,
      userId: req.session.UserID,
    });

    return vouch ? vouch.value : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isVouch = value !== -1;
    const realValue = isVouch ? 1 : -1;
    const userId = req.session.UserID;

    const vouch = await Vouch.findOne({ where: { postId, userId } });
    // the user has voted on the post before
    // and they are changing their vote
    if (vouch && vouch.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        //update vouch table
        await tm.query(
          `
    update vouch
    set value = $1
    where "postId" = $2 and "userId" = $3
        `,
          [realValue, postId, userId]
        );
        //update post points
        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
        `,
          [2 * realValue, postId]
        );
      });
    } else if (!vouch) {
      // hasn't voted on this post before
      await getConnection().transaction(async (tm) => {
        //insert into vouch table
        await tm.query(
          `
    insert into vouch ("userId", "postId", value)
    values ($1, $2, $3)
        `,
          [userId, postId, realValue]
        );
        //update post points
        await tm.query(
          `
    update post
    set points = points + $1
    where id = $2
      `,
          [realValue, postId]
        );
      });
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    // @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    console.log(replacements);
    const posts = await getConnection().query(
      `
    select p.*
    from post p
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // const qb = getConnection()
    // .getRepository(Post)
    // .createQueryBuilder("p")
    // .innerJoin(
    //   "p.creator",
    //   "u",
    //   'u.id = p."creatorId"'
    // )
    // .orderBy('p."createdAt"', "DESC")
    // .take(realLimitPlusOne);

    // if(cursor){
    //   qb.where('p."createdAt" < :cursor',{
    //     cursor: new Date(parseInt(cursor))});
    // }
    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    //const currPost = await Post.findOne(id);
    const postRepository = getConnection().getRepository(Post);
    const post = await postRepository.findOne({
      where: { id: id },
    });

    console.log("post:", post);
    return post;
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    const user = User.findOne({ id: req.session.UserID });
    return Post.create({
      ...input,
      creatorId: req.session.UserID,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", { nullable: true }) title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const post = await Post.findOne(id);

    if (!post) {
      return null;
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.UserID,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // not cascade way
    // const post = await Post.findOne(id);
    // if (!post) {
    //   return false;
    // }
    // if (post.creatorId !== req.session.userId) {
    //   throw new Error("not authorized");
    // }

    // await Updoot.delete({ postId: id });
    // await Post.delete({ id });

    await Post.delete({ id, creatorId: req.session.UserID });
    return true;
  }
}
