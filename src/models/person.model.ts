import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Person {
  @Field((type) => Int)
  id: number;
  name: string;
  description?: string;
}
