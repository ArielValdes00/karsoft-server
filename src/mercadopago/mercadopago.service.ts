import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Mercadopago } from './entities/mercadopago.entity';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
@Injectable()
export class MercadopagoService {

    async createSubscription() {
        try {
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
                    transaction_amount: 10000,
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

            const { init_point } = response.data;

            return init_point; 
        } catch (error) {
            console.error('Error creating subscription preference:', error.response ? error.response.data : error.message);
            throw new InternalServerErrorException('Error al crear la preferencia de suscripción');
        }
    }

    async getSuscripcion(payer_email: string) {
        try {
            const response = await axios.get(`${process.env.URL_MERCADOPAGO}/preapproval/search`, {
                params: {
                    payer_email: payer_email  
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

    async cancelarSuscripcion(preapprovalId: string) {
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

    async findOne(id: string) {
        try {
            const subscription = await Mercadopago.findOne({ where: { id } });
            if (!subscription) {
                throw new NotFoundException(`Suscripción con ID ${id} no encontrada`);
            }
            return subscription;
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
        try {        
            const preapprovalId = webhookData.data.id;
            const webhookType = webhookData.type;
    
            if (webhookType === 'subscription_preapproval') {
                await Mercadopago.create({
                    preapprovalId
                });
        
                console.log(`ID de preaprobación ${preapprovalId} guardado exitosamente en la base de datos`);
            } else {
                console.log(`Tipo de webhook no compatible: ${webhookType}`);
            }
        
        } catch (error) {
            console.error('Error handling webhook:', error.response ? error.response.data : error.message);
            throw new InternalServerErrorException('Error al procesar el webhook');
        }
    }
}
