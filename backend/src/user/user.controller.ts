import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
  } from '@nestjs/common';
  import { CreateUserDto } from './dto/create_user.dto';
  import { UserService } from './user.service';
  
  @Controller('user')
  export class UserController {
    constructor(private userService: UserService) {}
  
    @Get('getUsers')
    getUsers() {
      return this.userService.getAllUsers();
    }
  
    @Post()
    store(@Body() createUserDto: CreateUserDto) {
      return this.userService.createUser(createUserDto);
    }
  
    @Get('/:userId')
    getUser(@Param('userId', ParseIntPipe) userId: number) {
      return this.userService.getUser(userId);
    }
  
  }