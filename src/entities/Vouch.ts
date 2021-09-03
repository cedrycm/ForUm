import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

// many - to - many
// many users <-> many posts
// users -> vouch <- posts

@Entity()
export class Vouch extends BaseEntity {
  @Field()
  @Column({ type: "int" })
  value: number;

  @Field()
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.vouches)
  user: User;

  @Field()
  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.vouches)
  post: Post;
}
