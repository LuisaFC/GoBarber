// Responsavel por criar, armazenar, ler, deletar, editar os dados de appointments
// Responsavel por fazer as operações no banco de dados
// Responsavel por entregar os dados aos resto do código
import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  // Verificar se já existe agendamento para data e horário
  public async findByDate(date: Date): Promise<Appointment | null> {
    // se encontrar vai retornar o apppointment para a variavel, caso contrario vai retornar false
    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepository;
