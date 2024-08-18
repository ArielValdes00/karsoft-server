import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateWashDto } from './dto/create-wash.dto';
import { UpdateWashDto } from './dto/update-wash.dto';
import { Wash } from './entities/wash.entity';

@Injectable()
export class WashService {
    async create(userId: string, createWashDto: CreateWashDto): Promise<Wash> {

        try {
            const wash = await Wash.create({ ...createWashDto, userId });
            return wash;
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el lavado');
        }
    }

    async findAll(userId: string, page: number = 1, limit: number = 10): Promise<any> {
        const offset = (page - 1) * limit;
        try {
            const { count, rows } = await Wash.findAndCountAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return {
                data: rows,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            };
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener los lavados');
        }
    }

    async findOne(userId: string, id: string): Promise<Wash> {
        const wash = await Wash.findOne({ where: { id, userId } });
        if (!wash) {
            throw new NotFoundException(`Lavado con ID ${id} no encontrado`);
        }
        return wash;
    }

    async update(userId: string, id: string, updateWashDto: UpdateWashDto): Promise<Wash> {
        const wash = await this.findOne(userId, id);
        try {
            await wash.update({ ...updateWashDto });
            return wash;
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el lavado');
        }
    }

    async remove(userId: string, id: string): Promise<void> {
        const wash = await this.findOne(userId, id);
        try {
            await wash.destroy();
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar el lavado');
        }
    }
}
