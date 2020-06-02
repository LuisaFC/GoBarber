// Verificar se usuario realmente está autenticado na aplicação

import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

// Tudo o que for incluso em request e response estará acessivel para as proximar rotas subsequentes
export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validação do token JWT

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // Token vem assim: Bearer dshfsdf
  // Vamos separar o Bearer do dshfsdf
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    // Forçar formato da variavel
    const { sub } = decoded as TokenPayload;

    // a partir do momento que alguma rota utilizar esse midleware, dentro da rota teremos a info do user
    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
