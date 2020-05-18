import Express from 'express';
import { MongoClient, Db } from 'mongodb';
import bcrypt from 'bcrypt';

import { IUserModel } from '../../@core/interfaces';
import { Err } from '../../@core/errors';
import { generateToken } from '../../@core/utils/token_helpers';

import { validateSignUpBody, validateSignInBody } from './helpers';

class AuthController {
  db!: Db;
  connected = false;

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      const mongoclient = new MongoClient(process.env.MD_PORT || '', { useUnifiedTopology: true });

      await mongoclient.connect()
      this.db = mongoclient.db('Users');
      } catch (err) {
      throw new Err.InternalError();
    }
  }

  async getUserByEmail(email: string): Promise<IUserModel | null>  {
    return await this.db.collection('Users').findOne({ email });
  }

  public signUp = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
      if (!this.db) {
        await this.connect()
      }
  
      const user = await this.getUserByEmail(req.body.email);
  
      if (user) {
        throw new Err.UserAlreadyTakenError();
      } else {
        const isValid = validateSignUpBody(req.body);
        const userWithHashedPassword = {
          ...req.body,
          password: bcrypt.hashSync(req.body.password + process.env.SECRET_KEY, 12)
        }
        if (!isValid) {
          throw new Err.ValidationError();
        }
  
        this.db.collection('Users').insertOne(userWithHashedPassword, function (err: any) {
  
          if (err) {
            throw new Err.InternalError();
          }
      
          res.json({ token: generateToken(req.body.email )});
        });
      }
    } catch (error) {
      next(error);
    }
  }

  public signIn = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
      if (!this.db) {
        await this.connect()
      }

      const user = await this.getUserByEmail(req.body.email);

      if (!user) {
        throw new Err.UnauthorizedError();
      } else {
        const isValid = validateSignInBody(req.body);
        const isPasswordEqual = bcrypt.compareSync(req.body.password + process.env.SECRET_KEY, user.password);

        if (!isValid) {
          throw new Err.ValidationError();
        }

        if (!isPasswordEqual) {
          throw new Err.UnauthorizedError();
        }

        res.json({ token: generateToken(user.email )});
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();