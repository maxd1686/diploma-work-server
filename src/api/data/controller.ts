import { MongoClient, Db } from 'mongodb';
import Express from 'express';
import * as jwt from 'jsonwebtoken';

import { Err } from '../../@core/errors';
import { encodeToken } from '../../@core/utils/token_helpers';
import { IDataModel } from '../../@core/interfaces';

import { isPostDataPayloadValid } from './helpers';

class DataController {
  db!: Db;
  connected = false;

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      const mongoclient = new MongoClient(process.env.MD_PORT || '', { useUnifiedTopology: true });

      await mongoclient.connect()
      this.db = mongoclient.db('Data');
      } catch (err) {
      throw new Err.InternalError();
    }
  }

  authorize(req: Express.Request) {
    let credential: any;

    if (req.headers.authorization) {
      const [, token] = req.headers.authorization.split(' ');

      credential = encodeToken(token);
    }

    if (!credential || typeof credential !== 'string') {
      throw new Err.UnauthorizedError();
    }

    return credential;
  }

  public post = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
      if (!this.db) {
        await this.connect()
      }

      const credential = this.authorize(req);
      const isValid = isPostDataPayloadValid(req.body);

      if (credential && isValid) {
        const data: IDataModel = {
          data: req.body.data,
          createdAt: new Date().toString(),
          owner: credential,
        }
  
        this.db.collection('Data').insertOne(data, function (err: any) {
  
          if (err) {
            throw new Err.InternalError();
          }

          res.json(data);
        });
      }

      if (!isValid) {
        throw new Err.ValidationError();
      }
    } catch (error) {
      next(error);
    }
  }

  public get = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
      if (!this.db) {
        await this.connect()
      }

      const credential = this.authorize(req);
      const collection = await this.db.collection('Data').find({ owner: credential }).toArray();

      res.json({ list: collection });
    } catch (error) {
      next(error);
    }
  }
}

export default new DataController();