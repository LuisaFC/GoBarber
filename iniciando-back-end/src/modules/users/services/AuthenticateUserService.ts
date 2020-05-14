
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider'


interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // user.password -> Senha criptografada
    // password -> Senha não criptografada
    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

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
