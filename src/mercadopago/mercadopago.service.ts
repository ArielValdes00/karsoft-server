import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Mercadopago } from './entities/mercadopago.entity';
import { CreateMercadopagoDto } from './dto/create-mercadopago.dto';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class MercadopagoService {
    Preapproval: PreApproval;

    constructor() {
        const client = new MercadoPagoConfig({
            accessToken: process.env.API_SECRET_MERCADOPAGO,
            options: {
                timeout: 5000,
                idempotencyKey: 'abc',
            },
        });

        this.Preapproval = new PreApproval(client);
    }

    async createSubscription(subscriptionData: any) {
        console.log(subscriptionData)
        try {
            const response = await this.Preapproval.create({
                body: {
                    payer_email: subscriptionData.payer_email,
                    back_url: "http://localhost:3000/login",
                    preapproval_plan_id: subscriptionData.preapproval_plan_id,
                    auto_recurring: {
                        frequency: 1,
                        frequency_type: "months",
                        start_date: "2020-06-02T13:07:14.260Z",
                        end_date: "2022-07-20T15:59:52.581Z",
                        transaction_amount: subscriptionData.price,
                        currency_id: "ARS"
                    },
                    card_token_id: subscriptionData.card_token_id,
                },
            });
            return response;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw new InternalServerErrorException('Error al crear la suscripción');
        }
    }

    async findAll() {
        const mercadopago = await Mercadopago.findAll();
        if (!mercadopago) {
            throw new NotFoundException('No se pudieron encontrar los usuarios');
        }
        return mercadopago;
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
       console.log(webhookData)
    }
}
