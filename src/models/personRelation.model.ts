import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Person } from './person.model';

@ObjectType()
export class PersonRelation {
  @Field((type) => Int)
  id: number;

  @Field()
  from: Person;

  @Field()
  to: Person;

  @Field()
  description: string;
}
