import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const token = request.cookies['jwt'];
            if (!token) {
                throw new UnauthorizedException('No token provided');
            }
            const decoded = this.jwtService.verify(token);
            request.user = decoded;
            return !!decoded;
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
