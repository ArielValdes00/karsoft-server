import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const user = await this.authService.register(createUserDto);
            const { access_token } = await this.authService.login(createUserDto.email, createUserDto.password);
            return res.status(HttpStatus.OK).json({ success: true, access_token });
        } catch (error) {
            if (error.code === '23505') {
                throw new HttpException('User already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
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
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error en el proceso de autenticación' });
            }
        }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res() res: Response) {
        return res.send({ success: true });
    }

    @Get('verify')
    @UseGuards(JwtAuthGuard)
    async verifySession(@Req() req, @Res() res: Response) {
        const { user } = req;
        if (user) {
            const userType = user.type;
            return res.status(HttpStatus.OK).json({ session: true, userType, user });
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({ session: false });
        }
    }
}
