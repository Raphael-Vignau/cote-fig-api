import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { User } from '../decorators/user.decorator';
import { EmailValidGuard } from './guards/email-valid.guard';
import { UserEntity } from '../users/entities/user.entity';
import { EmailConfirmGuard } from './guards/email-confirm.guard';
import { EmailUniqueGuard } from './guards/email-unique.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(JwtAuthGuard, EmailUniqueGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('welcome/:id')
    async sendConfirm(@Param('id') id: string) {
        return await this.authService.sendWelcome(id);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user) {
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard, EmailUniqueGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post('add')
    async signUp(@Body() user: CreateUserDto): Promise<CreateUserDto> {
        return await this.authService.addUser(user);
    }

    @UseGuards(EmailValidGuard)
    @Post('reset')
    async resetPassword(@User() user: UserEntity) {
        return await this.authService.resetPassword(user);
    }

    @UseGuards(EmailConfirmGuard)
    @Post('confirm')
    async confirm(@User() user: UserEntity) {
        return await this.authService.confirm(user);
    }
}
