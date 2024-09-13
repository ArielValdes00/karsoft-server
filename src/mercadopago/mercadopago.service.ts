import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Mercadopago } from './entities/mercadopago.entity';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
@Injectable()
export class MercadopagoService {

    async createSubscription(userId: string) {
        try {
            const existingSubscription = await Mercadopago.findOne({ where: { userId } });

            if (existingSubscription) {
                return existingSubscription.init_point;
            }
            const response = await axios.post(`${process.env.URL_MERCADOPAGO}/preapproval_plan`, {
                reason: "karsoft",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    repetitions: 12,
                    billing_day_proportional: true,
                    free_trial: {
                        frequency: 7,
                        frequency_type: "days"
                    },
                    transaction_amount: 15,
                    currency_id: "ARS"
                },
                payment_methods_allowed: {
                    payment_types: [{ id: "credit_card" }],
                    payment_methods: [{ id: "visa" }]
                },
                back_url: process.env.URL_BACKEND_DEPLOY,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_SECRET_MERCADOPAGO}`,
                    'Content-Type': 'application/json'
                }
            });

            const { init_point, id } = response.data;

            const newSubscription = {
                userId,
                preapprovalId: id,
                init_point
            };

            await Mercadopago.create(newSubscription);
            return init_point;
        } catch (error) {
            console.error('Error creating subscription preference:', error.response ? error.response.data : error.message);
            throw new InternalServerErrorException('Error al crear la preferencia de suscripción');
        }
    }

    async getSuscripcion(preapproval_plan_id: string) {
        try {
            const response = await axios.get(`${process.env.URL_MERCADOPAGO}/preapproval/search`, {
                params: {
                    preapproval_plan_id: preapproval_plan_id
                },
                headers: {
                    'Authorization': `Bearer ${process.env.API_SECRET_MERCADOPAGO}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error al obtener la suscripción:', error.response ? error.response.data : error.message);
            throw new InternalServerErrorException('Error al obtener la suscripción');
        }
    }

    async getSuscripcionById(id: string) {
        try {
            const response = await axios.get(`${process.env.URL_MERCADOPAGO}/preapproval/${id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_SECRET_MERCADOPAGO}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error al obtener la suscripción:', error.response ? error.response.data : error.message);
            throw new InternalServerErrorException('Error al obtener la suscripción');
        }
    }

    async cancelSuscription(preapprovalId: string) {
        try {
            const response = await axios.put(`${process.env.URL_MERCADOPAGO}/${preapprovalId}`,
                {
                    status: "cancelled"
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.API_SECRET_MERCADOPAGO}`,
                        'Content-Type': 'application/json'
                    }
                });

            return response.data;
        } catch (error) {
            console.error('Error al cancelar la suscripción:', error.response ? error.response.data : error.message);
            throw new InternalServerErrorException('Error al cancelar la suscripción');
        }
    }

    async findAll() {
        const mercadopago = await Mercadopago.findAll();
        if (!mercadopago) {
            throw new NotFoundException('No se pudieron encontrar los usuarios');
        }
        return mercadopago;
    }

    async findOne(userId: string) {
        try {
            const subscription = await Mercadopago.findOne({ where: { userId } });
            if (subscription) {
                const response = await this.getSuscripcion(subscription.preapprovalId);
                if(response){
                    const preapproval_id = response?.results[0]?.id
                    const res = await this.getSuscripcionById(preapproval_id);
                    return res;
                }
            } else {
                throw new NotFoundException(`Suscripción con ID ${userId} no encontrada`);
            }
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la suscripción');
        }
    }

    async handleCancelSuscription(userId: string) {
        try {
            const subscription = await Mercadopago.findOne({ where: { userId } });
            if (subscription) {
                const response = await this.getSuscripcion(subscription.preapprovalId);
                if(response){
                    const preapproval_id = response?.results[0]?.id
                    const res = await this.cancelSuscription(preapproval_id);
                    return res;
                }
            } else {
                throw new NotFoundException(`Suscripción con ID ${userId} no encontrada`);
            }
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la suscripción');
        }
    }

    async update(id: string, updateMercadopagoDto: UpdateMercadopagoDto) {
        const subscription = await Mercadopago.findOne({ where: { id } });
        if (subscription) {
            return subscription.update(updateMercadopagoDto);
        }
        return null;
    }

    async remove(id: string) {
        const subscription = await Mercadopago.findOne({ where: { id } });
        if (subscription) {
            return subscription.destroy();
        }
        return null;
    }

    async handleWebhook(webhookData: any) {
        console.log(webhookData)
    }
}
