import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Person {
  constructor(id: number, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
