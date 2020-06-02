import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
  it('should be able to create authenticate', async () => {
    const fakeUserssRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(fakeUserssRepository, fakeHashProvider)
    const authenticateUser = new AuthenticateUserService(fakeUserssRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })


    const response = await authenticateUser.execute({
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUserssRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider()

    const authenticateUser = new AuthenticateUserService(fakeUserssRepository, fakeHashProvider);


    expect(
      authenticateUser.execute({
        email: 'johndoe@gmail.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
;
  });

  it('should be able to authenticate with wrong password', async () => {
    const fakeUserssRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(fakeUserssRepository, fakeHashProvider)
    const authenticateUser = new AuthenticateUserService(fakeUserssRepository, fakeHashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    expect(
      authenticateUser.execute({
        email: 'johndoe@gmail.com',
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError)

  });


})
