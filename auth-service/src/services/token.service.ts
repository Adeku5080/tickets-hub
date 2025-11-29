import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenPurpose } from "src/enums/auth.enum";
import { ContextLogger } from "src/config/logger/context.logger";

interface JwtPayload {
  [key: string]: any;
  purpose?: TokenPurpose;
}

interface PurposeSettings {
  secret: string;
  expiresIn: string;
}

@Injectable()
export class TokenService{

  private readonly logger = new ContextLogger('TokenService');
  constructor(private readonly jwtService: JwtService) {}

  private readonly purposeSettings: Record<TokenPurpose, PurposeSettings> = {
    [TokenPurpose.Auth]: {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    },
    [TokenPurpose.RESET_PASSWORD]: {
      secret: process.env.RESET_PASSWORD_JWT_SECRET,
      expiresIn: '10m',
    },
    [TokenPurpose.Refresh]: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    },
  };

  generateToken<T extends JwtPayload = JwtPayload>(
    payload: Omit<T, 'purpose'>,
    purpose: TokenPurpose,
    overrideExpiresIn?: string,
  ): string {
    const settings = this.purposeSettings[purpose];
    if (!settings) {
      this.logger.error({
        message: 'Unknown token purpose',
        description: `Attempted to generate a token with an unknown purpose: ${purpose}`,
        functionName: 'generateToken',
      });

      throw new BadRequestException(`Unknown token purpose: ${purpose}`);
    }

    const fullPayload = { ...payload, purpose };

    return this.jwtService.sign(fullPayload, {
      secret: settings.secret,
      expiresIn: overrideExpiresIn || settings.expiresIn,
      issuer: process.env.APP_HOST,
    });
  }

  verifyToken<T extends JwtPayload = JwtPayload>(
    token: string,
    expectedPurpose: TokenPurpose,
  ): T {
    const settings = this.purposeSettings[expectedPurpose];
    if (!settings) {
      this.logger.error({
        message: 'Unknown token purpose',
        description: `Attempted to verify a token with an unknown purpose: ${expectedPurpose}`,
        functionName: 'verifyToken',
      });
      throw new BadRequestException(
        `Unknown token purpose: ${expectedPurpose}`,
      );
    }

    if (!token) {
      this.logger.warn({
        message: 'Token is required',
        description: 'No token provided for verification.',
        functionName: 'verifyToken',
      });
      throw new UnauthorizedException('Token is required');
    }

    try {
      const decoded = this.jwtService.verify<T>(token, {
        secret: settings.secret,
      });

      if (decoded.purpose !== expectedPurpose) {
        this.logger.warn({
          message: 'Token purpose mismatch',
          description: `Expected purpose ${expectedPurpose}, but got ${decoded.purpose}`,
          functionName: 'verifyToken',
        });
        throw new UnauthorizedException(
          `Token purpose mismatch: expected ${expectedPurpose}, got ${decoded.purpose}`,
        );
      }

      return decoded;
    } catch (err) {
      this.logger.error({
        message: 'Token verification failed',
        description: err.message || 'Invalid or expired token',
        functionName: 'verifyToken',
      });
      throw new UnauthorizedException(
        err.message || 'Invalid or expired token',
      );
    }
  }

  decodeProviderToken(token: string): any {
    try {
      return this.jwtService.decode(token);
    } catch (err) {
      this.logger.error({
        message: 'Provider token decoding failed',
        description: err.message || 'Invalid or malformed SSO provider token',
      });
      throw new UnauthorizedException(
        err.message || 'Invalid or malformed SSO provider token',
      );
    }
  }
    
}