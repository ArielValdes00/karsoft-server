import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Mercadopago } from './entities/mercadopago.entity';
import { CreateMercadopagoDto } from './dto/create-mercadopago.dto';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import * as dotenv from 'dotenv';
import axios from 'axios';

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

    async createSubscription(userId: any) {
        try {
            const response = await axios.post(`${process.env.URL_MERCADOPAGO}`, {
                reason: "karsoft",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    repetitions: 12,
                    billing_day: 10,
                    billing_day_proportional: true,
                    free_trial: {
                        frequency: 1,
                        frequency_type: "months"
                    },
                    transaction_amount: 10000,
                    currency_id: "ARS"
                },
                payment_methods_allowed: {
                    payment_types: [
                        {"id": "credit_card"}
                    ],
                    payment_methods: [
                        {"id": "visa"}
                    ]
                },
                back_url: process.env.URL_BACKEND_DEPLOY,
                external_reference: userId
            }, {
                headers: {
                    'Authorization':`Bearer ${process.env.SECRET_MERCADOPAGO}`,
                    'Content-Type': 'application/json'
                }
            });
    
            return response.data.init_point;
        } catch (error) {
            console.error('Error creating subscription preference:', error.response ? error.response.data : error.message);
            throw new InternalServerErrorException('Error al crear la preferencia de suscripción');
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
        console.log("webhook",webhookData)
       
    }
}
