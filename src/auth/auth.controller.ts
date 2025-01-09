import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const user = await this.authService.register(createUserDto);

            const { access_token } = await this.authService.login(createUserDto.email, createUserDto.password);

            return res.status(HttpStatus.OK).json({ success: true, access_token, id: user.id });
        } catch (error) {
            if (error.code === '23505') {
                throw new HttpException('User already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Req() req, @Res() res: Response) {
        try {
            const { user } = req;
            if (user) {
                const fullUser = await this.userService.findOne(user.sub);
                return res.status(HttpStatus.OK).json({ success: true, user: fullUser });
            } else {
                return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Usuario no autenticado' });
            }
        } catch (error) {
            console.log(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error al obtener información del usuario' });
        }
    }

    @Post('login')
    async login(@Req() req, @Res() res: Response) {
        const { email, password } = req.body;
        try {
            const { access_token } = await this.authService.login(email, password);
            return res.status(HttpStatus.OK).json({ success: true, access_token });
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: error.message });
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'Error en el proceso de autenticación' });
            }
        }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res() res: Response) {
        return res.send({ success: true });
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        const results = await this.authService.forgotPassword(forgotPasswordDto.email);
        return results;
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        const results = await this.authService.resetPassword(
            resetPasswordDto.token,
            resetPasswordDto.newPassword,
            resetPasswordDto.confirmPassword
        );
        return results;
    }

    @Post('change-password/:id')
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @Param('id') id: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        const results = await this.authService.changePassword(
            id,
            changePasswordDto.currentPassword,
            changePasswordDto.newPassword,
            changePasswordDto.confirmPassword,
        );
        return results;
    }

    @Get('verify')
    @UseGuards(JwtAuthGuard)
    async verifySession(@Req() req, @Res() res: Response) {
        console.log(req, res)
        const { user } = req;
        if (user) {
            const userType = user.type;
            return res.status(HttpStatus.OK).json({ session: true, userType, user });
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({ session: false });
        }
    }
}
