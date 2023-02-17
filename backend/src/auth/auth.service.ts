import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService{

    signin(){
        return{msg:'i have signed in'}
    }
    signup(){
        return{msg:'i have signed up'}
    }
}