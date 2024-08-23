import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Mercadopago } from './entities/mercadopago.entity';
import { CreateMercadopagoDto } from './dto/create-mercadopago.dto';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';

@Injectable()
export class MercadopagoService {

  async create(createMercadopagoDto: CreateMercadopagoDto) {
    return Mercadopago.create(createMercadopagoDto);
  }

  async findAll() {
    return Mercadopago.findAll();
  }

  async findOne(id: string) {
    try {
      const subscription = await Mercadopago.findOne({ where: { preapprovalId: id } });
      if (!subscription) {
        throw new NotFoundException(`Suscripción con ID ${id} no encontrada`);
      }
      return subscription;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la suscripción');
    }
  }


  async update(id: string, updateMercadopagoDto: UpdateMercadopagoDto) {
    const subscription = await Mercadopago.findOne({ where: { preapprovalId: id } });
    if (subscription) {
      return subscription.update(updateMercadopagoDto);
    }
    return null;
  }

  async remove(id: string) {
    const subscription = await Mercadopago.findOne({ where: { preapprovalId: id } });
    if (subscription) {
      return subscription.destroy();
    }
    return null;
  }

  async handleWebhook(webhookData: any) {
    const { id, status, payer_email, amount, next_payment_date, application_id } = webhookData.data;
    console.log(webhookData)

    try {
      let subscription = await this.findOne(id);
      if (subscription) {
        subscription.status = status;
        subscription.payerEmail = payer_email;
        subscription.amount = amount;
        subscription.nextPaymentDate = next_payment_date;
        subscription.applicationId = application_id;
        return await subscription.save();
      } else {
        return await this.create({
          preapprovalId: id,
          status,
          payerEmail: payer_email,
          amount,
          nextPaymentDate: next_payment_date,
          applicationId: application_id,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException('Error al manejar el webhook');
    }
  }
}
