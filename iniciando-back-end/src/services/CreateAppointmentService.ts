// Responsavel apenas pela criação do agendamento
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

// DTO de recebimento
interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  // Recebe o date e o provider
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    // Zerando minutos, segundo e milissegundo
    const appointmentDate = startOfHour(date);

    // Verifica data
    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    // Data indisponivel
    if (findAppointmentInSameDate) {
      throw new AppError('This apppointment is alredy booked');
    }

    // Cria agendamento
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    // Retorna agendamento
    return appointment;
  }
}

export default CreateAppointmentService;
