import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Person } from './person.model';

@ObjectType()
export class PersonAlias {
  @Field((type) => Int)
  id: number;

  personId: number;

  @Field()
  alias: string;

  @Field(() => Person)
  person: Person;
}
