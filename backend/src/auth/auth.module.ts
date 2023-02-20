import {Module} from '@nestjs/common'
import { PassportModule } from '@nestjs/passport/dist/passport.module'
import { UserModule } from 'src/user/user.module'
import { jwtConstants } from './auth.constant'
import {JwtModule} from '@nestjs/jwt'
import { AuthController } from './auth.controler'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStategy } from './jwt.strategy'
@Module({
    controllers:[AuthController],
    imports:[
            PassportModule,UserModule,
            JwtModule.register({
                secret:jwtConstants.secret,
                signOptions:{expiresIn:'60s'}
            })
        ],
    providers:[LocalStrategy,AuthService,JwtStategy],
    
})
export class AuthModule {

}