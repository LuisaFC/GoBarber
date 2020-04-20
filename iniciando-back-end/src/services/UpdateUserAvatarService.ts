import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    // Verificar se id é de usuario valido
    const user = await userRepository.findOne(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    // deletar avatar anterior
    if (user.avatar) {
      // Buscar pelo arquivo de avatar do usuario
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      // Checar se arquivo realmente existe
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await userRepository.save(user);

    return user;
  }
}
export default UpdateUserAvatarService;
