// Responsavel apenas pela criação do agendamento
import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// DTO de recebimento
interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  // Recebe o date e o provider
  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    // Zerando minutos, segundo e milissegundo
    const appointmentDate = startOfHour(date);

    // Verifica data
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    // Data indisponivel
    if (findAppointmentInSameDate) {
      throw new AppError('This apppointment is alredy booked');
    }

    // Cria agendamento
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // Retorna agendamento
    return appointment;
  }
}

export default CreateAppointmentService;
