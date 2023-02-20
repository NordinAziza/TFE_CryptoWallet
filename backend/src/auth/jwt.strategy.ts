import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./auth.constant";

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy){
    
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload:any){
        return{sub:payload.sub, email:payload.email}
    }
}