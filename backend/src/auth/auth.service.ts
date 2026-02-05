import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../database/entities/user.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { RefreshToken } from '../database/entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { generateSlug } from '../utils/slug-generator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      phone: registerDto.phone,
      role: UserRole.SPECIALIST,
    });
    const savedUser = await this.userRepository.save(user);

    const slug = generateSlug(registerDto.name, registerDto.category, registerDto.location);

    const specialist = this.specialistRepository.create({
      userId: savedUser.id,
      slug,
      name: registerDto.name,
      email: registerDto.email,
      phone: registerDto.phone,
      category: registerDto.category,
      location: registerDto.location,
      bio: registerDto.bio || '',
      yearsExperience: registerDto.yearsExperience,
      hourlyRate: registerDto.hourlyRate || 0,
      services: registerDto.services || [],
      certifications: registerDto.certifications || [],
      education: registerDto.education || '',
      website: registerDto.website || null,
      linkedin: registerDto.linkedin || null,
      availability: registerDto.availability || [],
    });
    await this.specialistRepository.save(specialist);

    const tokens = await this.generateTokens(savedUser);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const storedToken = await this.refreshTokenRepository.findOne({ where: { token: refreshToken } });
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete(storedToken.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userRepository.findOne({ where: { id: storedToken.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      },
    );

    return { accessToken };
  }

  async logout(userId: string) {
    await this.refreshTokenRepository.delete({ userId });
  }

  private async generateTokens(user: User) {
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.save({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }
}
