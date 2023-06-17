import { CreateUserData, User } from "../models/user.model"

export class UserService {
    static login(username: string, password: string){
        return fetch("http://localhost:4000/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                "content-type": "application/json",
            }
        }).then(res => {
            if( res.status >= 400 ){
                return res.json().then(Promise.reject);
            }
            return res.json() as Promise<User>
        })
    }
    static register(userInfo: CreateUserData){
        return fetch("http://localhost:4000/users", {
            method: "POST",
            body: JSON.stringify(
                {
                    username: userInfo.username,
                    password: userInfo.password,
                    name: userInfo.name,
                    balance: 1000
                } 
            ),
            headers: {
                "content-type":"application/json"
            }
        }).then(res => {
            if( res.status >= 400 ){
                return Promise.reject(res)
            }
            return res.json() as Promise<User>
        })
    }
}