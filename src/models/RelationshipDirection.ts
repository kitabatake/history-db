import { ObjectType, registerEnumType } from '@nestjs/graphql';

export enum RelationshipDirection {
  INWARD,
  OUTWARD,
}

registerEnumType(RelationshipDirection, {
  name: 'RelationshipDirection',
});
