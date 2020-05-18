import * as jwt from 'jsonwebtoken';

import { Err } from '../errors';

export function generateToken(credential: string) {
  if(!process.env.SECRET_KEY) {
    throw new Err.InternalError();
  }

  return jwt.sign({
    credential,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12) // seconds * minutes * hours
  }, process.env.SECRET_KEY)
}

export function encodeToken(token: string) {
  if(!process.env.SECRET_KEY) {
    throw new Err.InternalError();
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken.exp ||  Number(decodedToken.exp) < (Date.now() / 1000)) {
      throw new Err.UnauthorizedError();
    }

    return decodedToken.credential;
  } catch(err) {
    throw new Err.UnauthorizedError();
  }
}