import * as S from "../support/schema"

export type CreateUserData = {
    username: string,
    password: string,
    name: string
}

export const CreateSchema = S.makeSchema({
    username: S.minLength(4),
    password: S.minLength(7),
    name: S.minLength(5)
})

export type Credentials = Pick<User, "username" | "password">

export const CredentialsSchema = S.makeSchema({
    username: S.notEmpty(),
    password: S.notEmpty()
})

export interface User extends CreateUserData {
    id: string,
}