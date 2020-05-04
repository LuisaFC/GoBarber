import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';

import AppError from './errors/AppError';

import './database';

const app = express();

app.use(cors());

// Aplicação entenda o formato json
app.use(express.json());

app.use('/files', express.static(uploadConfig.directory));

// adicionando todas as rotas definidas em routes para dentro do app
app.use(routes);

// Tratativa global dos erros da aplicação
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // Verificar se o erro é uma instacia da classe AppError
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on port 3333');
});
