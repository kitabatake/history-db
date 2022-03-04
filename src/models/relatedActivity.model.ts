import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Activity } from './activity.model';
import { Relationship } from 'neo4j-driver-core/types/graph-types';
import { Node } from 'neo4j-driver';
import { Person } from './person.model';
import { RelationshipDirection } from './RelationshipDirection';

@ObjectType()
export class RelatedActivity {
  static createFromGraphData(
    rel: Relationship,
    activity: Node,
  ): RelatedActivity {
    return new RelatedActivity(
      rel.identity.toNumber(),
      rel.type,
      Activity.createFromGraphNode(activity),
      rel.start.toNumber() == activity.identity.toNumber()
        ? RelationshipDirection.INWARD
        : RelationshipDirection.OUTWARD,
    );
  }

  constructor(
    id: number,
    label: string,
    activity: Activity,
    direction: RelationshipDirection,
  ) {
    this.id = id;
    this.label = label;
    this.activity = activity;
    this.direction = direction;
  }

  @Field((type) => Int)
  id: number;

  @Field()
  label: string;

  @Field(() => Activity)
  activity: Activity;

  @Field(() => RelationshipDirection)
  direction: RelationshipDirection;
}
