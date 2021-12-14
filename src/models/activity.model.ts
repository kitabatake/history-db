import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Person } from './person.model';

@ObjectType()
export class Activity {
  @Field((type) => Int)
  id: number;

  @Field()
  description?: string;
}
