import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async register(email: string, username: string, password: string) {
        const existingEmail = await this.usersService.findByEmail(email);
        if (existingEmail) {
            throw new BadRequestException("Email already exists");
        }

        const existingUsername = await this.usersService.findByUsername(username);
        if (existingUsername) {
            throw new BadRequestException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.usersService.create({
            email,
            username,
            password: hashedPassword,
        });

        return { id: user._id, email: user.email, username: user.username }
    }

    async login(identifier: string, password: string) {
        const user = 
            (await this.usersService.findByEmail(identifier)) ||
            (await this.usersService.findByUsername(identifier));

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = { sub: user._id, username: user.username };

        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}
