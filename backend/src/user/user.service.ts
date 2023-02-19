import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create_user.dto";


@Injectable()

export class UserService {

  constructor(
    @InjectRepository(User) // Use the InjectRepository decorator to inject the User repository
    private userRepository: Repository<User> // Assign the injected repository to a private property called 'userRepository'
  ) {}

  // Define a method called getAllUsers that returns a Promise of an array of User objects
  getAllUsers(): Promise<User[]> {
    return this.userRepository.find(); // Use the repository's find method to retrieve all users from the database
  }

  // Define a method called createUser that accepts a parameter called 'createUserDto' and returns a Promise
  createUser(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto); // Use the repository's save method to create a new user in the database
  }

  getUser(id: number) {
    return this.userRepository.findOne({ where: { id:Equal(id)} });
  }
  
}