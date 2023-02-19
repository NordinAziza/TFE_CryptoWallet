import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create_user.dto";
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getAllUsers(): Promise<User[]>;
    createUser(createUserDto: CreateUserDto): Promise<CreateUserDto & User>;
    getUser(id: number): Promise<User>;
}
