import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
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
            res.cookie('jwt', access_token, { httpOnly: true, secure: true, sameSite: 'none' });

            res.cookie('isAuthenticated', 'true', { httpOnly: false });

            return res.status(HttpStatus.OK).json({ success: true });
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
            res.cookie('jwt', access_token, { httpOnly: true, secure: true, sameSite: 'none' });
            
            res.cookie('isAuthenticated', 'true', { httpOnly: false });

            return res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Credenciales inválidas' });
        }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res() res: Response) {
        res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
        res.cookie('isAuthenticated', '', { httpOnly: false });
        return res.send({ success: true });
    }

    @Get('verify')
    @UseGuards(JwtAuthGuard)
    async verifySession(@Req() req, @Res() res) {
        if (req.user) {
            return res.status(HttpStatus.OK).json({ session: true, user: req.user });
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({ session: false });
        }
    }
}
