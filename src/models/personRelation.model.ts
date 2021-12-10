import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Person } from './person.model';

@ObjectType()
export class PersonRelation {
  // constructor(id: number, description: string, persons: Person[]) {
  //   this.id = id;
  //   this.description = description;
  //   this.persons = persons;
  // }
  @Field((type) => Int)
  id: number;

  // @Field(() => [Person])
  // persons: Person[];

  @Field()
  description: string;
}
