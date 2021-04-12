import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PersonRelation } from './personRelation.model';

@ObjectType()
export class Person {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [PersonRelation])
  relationsFrom: PersonRelation[];

  @Field(() => [PersonRelation])
  relationsTo: PersonRelation[];
}
