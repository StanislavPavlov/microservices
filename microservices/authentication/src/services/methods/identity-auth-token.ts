import { IsNullable, IsUndefinable } from '@lomray/microservice-helpers';
import { BaseException } from '@lomray/microservice-nodejs-lib';
import { IsBoolean, IsEnum, Length } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import Cookie from 'cookie';
import { Repository } from 'typeorm';
import type { IJwtConfig } from '@config/jwt';
import AuthProviders from '@constants/auth-providers';
import UnauthorizedCode from '@constants/unauthorized-code';
import Token from '@entities/token';
import Jwt from '@services/tokens/jwt';

class TokenIdentifyInput {
  @Length(1, 300)
  @IsUndefinable()
  token?: string;
}

@JSONSchema({
  examples: [{ userId: 'sample-user-id', isAuth: true, provider: 'jwt' }],
})
class TokenIdentifyOutput {
  @Length(1, 36)
  @IsNullable()
  @IsUndefinable()
  tokenId?: string | null;

  @Length(1, 36)
  @IsNullable()
  @IsUndefinable()
  userId?: string | number | null;

  @IsBoolean()
  @IsUndefinable()
  isAuth?: boolean;

  @IsEnum(AuthProviders)
  @IsUndefinable()
  provider?: AuthProviders | null;
}

/**
 * Identify auth token
 */
class IdentifyAuthToken {
  /**
   * @private
   */
  private repository: Repository<Token>;

  /**
   * @private
   */
  private readonly jwtConfig: IJwtConfig;

  /**
   * @constructor
   */
  constructor(repository: Repository<Token>, jwtConfig: IJwtConfig) {
    this.repository = repository;
    this.jwtConfig = jwtConfig;
  }

  /**
   * Get authorization token from headers
   * @private
   */
  public static getHeaderAuth(headers?: Record<string, any>): string | undefined {
    const token = headers?.Authorization ?? headers?.authorization;

    if (token) {
      return token.split('Bearer ')?.[1];
    }

    return undefined;
  }

  /**
   * Get auth token from cookies
   * @private
   */
  public static getCookieAuth(headers?: Record<string, any>): string | undefined {
    const cookies = headers?.cookie;

    if (!cookies) {
      return undefined;
    }

    const parsedCookies = Cookie.parse(cookies);

    return parsedCookies?.['jwt-access'];
  }

  /**
   * Find auth token in db
   * @private
   */
  private async findToken(token: string): Promise<Required<Omit<TokenIdentifyOutput, 'payload'>>> {
    const isPersonal = String(token).length === 32;

    let dbToken: Token | undefined;

    if (!isPersonal) {
      const { secretKey, ...jwtOptions } = this.jwtConfig;
      const jwtService = new Jwt(secretKey, jwtOptions);
      const { jti } = jwtService.validate(token);

      dbToken = await this.repository.findOne({ id: jti });
    } else {
      dbToken = await this.repository.findOne({ personal: token });

      // Check personal token expiration
      if (dbToken && dbToken.expirationAt !== null) {
        const now = Math.round(Date.now() / 1000);

        if (now > dbToken.expirationAt) {
          throw new BaseException({
            message: 'Unauthorized',
            status: 401,
            code: UnauthorizedCode.PERSONAL_EXPIRED,
            payload: { message: 'Personal access token expired.' },
          });
        }
      }
    }

    if (!dbToken) {
      throw new BaseException({
        message: 'Unauthorized',
        status: 401,
        code: UnauthorizedCode.TOKEN_NOT_EXIST,
        payload: { message: 'Auth token not exist.' },
      });
    }

    return {
      tokenId: dbToken.id,
      userId: dbToken.userId,
      isAuth: true,
      provider: isPersonal ? AuthProviders.personal : AuthProviders.jwt,
    };
  }

  /**
   * Identify token
   */
  identify(
    params: TokenIdentifyInput,
    headers?: Record<string, any>,
  ): Promise<TokenIdentifyOutput> {
    const { token } = params;
    const authToken =
      token ?? IdentifyAuthToken.getHeaderAuth(headers) ?? IdentifyAuthToken.getCookieAuth(headers);

    if (!authToken) {
      return Promise.resolve({
        tokenId: null,
        userId: null,
        isAuth: false,
        provider: null,
      });
    }

    return this.findToken(authToken);
  }
}

export { IdentifyAuthToken, TokenIdentifyInput, TokenIdentifyOutput };
