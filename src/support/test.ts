import * as E from "jazzi/dist/Either/fluent"
import { CreateUserData } from "../models/user.model";

const validateName = (name: string) => E
    .fromCondition(n => n.length > 0 , name)
    .mapLeft(() => "Nombre es muy corto" as const)

const validateUserName = (username: string) => E
    .fromFalsy("Username must not be falsy" as const, username)

const validatePassword = (password: string) => E
    .fromCondition(p => p.length > 8, password)
    .mapLeftTo("Contrasena muy corta" as const)
    .chain(pass => {
        if(/^[a-z0-9]$/.test(pass)){
            return E.Right(pass);
        }
        return E.Left("Tiene que ser alfanumerico" as const);
    })

export const validateUserData = (data: CreateUserData) => {
    return validateName(data.name)
        .zip(validateUserName(data.username))
        .zip(validatePassword(data.password))
        .map(() => data)
}