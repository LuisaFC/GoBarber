import User from '../infra/typeorm/entities/User';
import ICreateDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateDTO): Promise<User>;
  save(user: User): Promise<User>;
}
