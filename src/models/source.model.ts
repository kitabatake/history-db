import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Source {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
