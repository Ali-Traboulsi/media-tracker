import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

export interface SignUpDto {
  email: string;
  password: string;
  name?: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, name } = signUpDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and account
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        accounts: {
          create: [
            {
            type: 'credentials',
              provider: 'credentials',
              password: hashedPassword,
            },
          ],
        },
      },
      include: {
        accounts: true,
      },
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Find user with credentials account
    const user = await this.prisma.user.findUnique({
      where: { email },
        include: {
            accounts: {
            where: { provider: 'credentials' },
            select: { password: true },
            },
        },
    });

    if (!user || !user.accounts || user.accounts.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const accountPassword = user.accounts[0].password ?? '';
    const isPasswordValid = await bcrypt.compare(password, accountPassword);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}