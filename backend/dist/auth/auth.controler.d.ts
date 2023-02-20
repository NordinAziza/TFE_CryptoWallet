import { AuthService } from "./auth.service";
export declare class AuthController {
    private AuthService;
    constructor(AuthService: AuthService);
    signIn(request: any): Promise<{
        acces_token: string;
    }>;
}
