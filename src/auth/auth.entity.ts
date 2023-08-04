import { Field, ObjectType } from "@nestjs/graphql";
import { type } from "os";
import { User } from "src/user/user.entity";


@ObjectType()
export class LoginResult {

    @Field((type) => String)
    token: string;

    @Field((type) => User)
    user: User;
}