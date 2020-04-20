import { getRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '../errors/AppError';

import User from '../models/User';
import authConfig from '../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // user.password -> Senha criptografada
    // password -> Senha não criptografada
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    // Tudo o que se colocar como primeiro parametro no sign é chamado de Payload
    // Payload -> informações que ficarão no token de forma criptografada mas não é seguro
    // O segundo parametro é uma chave secreta - pegar no md5online
    // O terceiro parametro são configurações do token
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn, // daqui 24h ele precisrá fazer login novamente
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
