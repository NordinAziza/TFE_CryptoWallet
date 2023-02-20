import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { AuthService } from "./auth.service";


@Controller({})

export class AuthController{
    constructor(private AuthService:AuthService){ }

   @UseGuards(AuthGuard('local'))
   @Post('signIn')
   async signIn(@Request() request:any){ 
        return this.AuthService.login(request.user);
        
    }
   
}