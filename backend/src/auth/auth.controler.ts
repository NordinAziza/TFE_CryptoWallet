import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Controller({})

export class AuthController{
    constructor(private AuthService:AuthService){
        
    }
    @Post('signup')
    signUp(){
        return this.AuthService.signup()
    }
    @Post('signin')
    signIn(){
        return this.AuthService.signin()
    }
}