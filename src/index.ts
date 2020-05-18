import Express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env' })
}

import { AuthController } from './api/auth';
import { DataController } from './api/data';
import { ErrorHandler } from './@core/middlewares';

const app = Express();
const aliveAt = new Date().toISOString();

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors({
  optionsSuccessStatus: 200,
}));

app.get('/', (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  res.status(200).send({
    aliveAt: aliveAt,
    timestamp: new Date().toISOString(),
    uptime: Date.now() - new Date(aliveAt).getTime(),
  });

  next();
});

app.post('/sign_up', AuthController.signUp);

app.post('/sign_in', AuthController.signIn);

app.get('/get_data', DataController.get);

app.post('/post_data', DataController.post);

app.use(ErrorHandler);
app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));

