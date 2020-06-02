// Responsavel por criar, armazenar, ler, deletar, editar os dados de appointments
// Responsavel por fazer as operações no banco de dados
// Responsavel por entregar os dados aos resto do código
import { getRepository, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  // Verificar se já existe agendamento para data e horário
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    // se encontrar vai retornar o apppointment para a variavel, caso contrario vai retornar false
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date });

    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
