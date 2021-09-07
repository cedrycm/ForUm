import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,  } from "typeorm";
import { Post } from "./Post";
import { Vouch } from "./Vouch";

@ObjectType()
@Entity()
export class User  extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique:true })
  username!: string;

  @Field()
  @Column({ unique:true })
  email!: string;

  @Column({})
  password!: string;

  @OneToMany(() => Post, post => post.creator)
  posts:Post[];

  @OneToMany(() => Vouch, vouch => vouch.user)
  vouches:Vouch[];
  
  @Field(() =>  String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();
}