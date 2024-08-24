import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Headers } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { CreateMercadopagoDto } from './dto/create-mercadopago.dto';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post()
  create(@Body() createMercadopagoDto: CreateMercadopagoDto) {
    return this.mercadopagoService.create(createMercadopagoDto);
  }

  @Get()
  findAll() {
    return this.mercadopagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mercadopagoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMercadopagoDto: UpdateMercadopagoDto) {
    return this.mercadopagoService.update(id, updateMercadopagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mercadopagoService.remove(id);
  }

  @Post('webhook')
  @HttpCode(200)  
  async handleWebhook(
    @Body() webhookData: any, 
    @Headers('x-signature') signature: string
  ) {
    
    return this.mercadopagoService.handleWebhook(webhookData);
  }
}
