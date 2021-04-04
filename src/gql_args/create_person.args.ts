import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreatePersonArgs {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;
}
