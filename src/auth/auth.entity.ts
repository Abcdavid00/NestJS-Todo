import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";


@ObjectType()
export class LoginResult {

    @Field()
    token: string;

    @Field()
    user: User;
}