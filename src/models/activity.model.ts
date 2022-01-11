import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Person } from './person.model';
import { Source } from './source.model';

@ObjectType()
export class Activity {
  @Field((type) => Int)
  id: number;

  @Field()
  description?: string;

  @Field(() => Int, { nullable: true })
  year?: number;

  @Field(() => Int, { nullable: true })
  month?: number;

  @Field(() => Int, { nullable: true })
  day?: number;

  @Field(() => Source, { nullable: true })
  source?: Source;
}
