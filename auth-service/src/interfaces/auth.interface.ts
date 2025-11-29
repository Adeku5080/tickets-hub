import { Request } from 'express';
import { TokenPurpose } from 'src/enums/auth.enum';

export interface PurposeSettings {
  secret: string;
  expiresIn: string;
}

export interface JwtPayload {
  sub: string;
  purpose: TokenPurpose;
  [key: string]: any;
}
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

