import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Person {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
