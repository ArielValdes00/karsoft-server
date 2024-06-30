import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Req() req, @Res() res: Response) {
        const { email, password } = req.body;
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Credenciales inválidas' });
        }

        const { access_token } = await this.authService.login(user);
        res.cookie('jwt', access_token, { httpOnly: true, secure: true, sameSite: 'none' });
        return res.status(HttpStatus.OK).json({ message: 'Logged in successfully', user });
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res() res: Response) {
        res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
        return res.send({ message: 'Logged out successfully' });
    }

    @Get('verify')
    @UseGuards(JwtAuthGuard)
    async verifySession(@Req() req, @Res() res) {
        if (req.user) {
            return res.status(HttpStatus.OK).json({ session: true });
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({ session: false });
        }
    }
}
