import { AuthService } from "./auth.service";
export declare class AuthController {
    private AuthService;
    constructor(AuthService: AuthService);
    signUp(): {
        msg: string;
    };
    signIn(): {
        msg: string;
    };
}
