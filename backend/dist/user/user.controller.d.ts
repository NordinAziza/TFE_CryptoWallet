import { CreateUserDto } from './dto/create_user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUsers(): Promise<import("./entity/user.entity").User[]>;
    store(createUserDto: CreateUserDto): Promise<CreateUserDto & import("./entity/user.entity").User>;
    getUser(userId: number): Promise<import("./entity/user.entity").User>;
}
