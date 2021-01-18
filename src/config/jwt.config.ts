import * as config from 'config';

const jwtConfig: any = config.get('jwt');

export const secret = process.env.JWT_SECRET || jwtConfig.secret;
export const expiresIn = process.env.JWT_SECRET || jwtConfig.expiresIn;