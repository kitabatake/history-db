import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Person } from './person.model';
import { Source } from './source.model';
import { Node } from 'neo4j-driver';

@ObjectType()
export class Activity {
  static createFromGraphNode(node: Node): Activity {
    return new Activity(
      node.identity.toNumber(),
      node.properties['name'],
      node.properties['description'],
    );
  }

  constructor(id: number, name: string, description?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

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
