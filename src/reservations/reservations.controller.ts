import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dtos/create-reservation.dto';


@ApiTags('Reservations')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}

    @ApiOperation({summary: 'Reserve a seat at a seminar (Token required)'})
    @Post()
    async create(@Req() req: any, @Body() createReservationDto: CreateReservationDto) {
        const userId = req.user?.id || req.user?.sub || req.user?.userId;
        return this.reservationsService.createReservation(userId, createReservationDto.seminarId)
    }

    @ApiOperation({summary: 'View current users bookings'})
    @Get('my-reservations')
    async getMyReservations(@Req() req: any) {
        const userId = req.user?.id || req.user?.sub || req.user?.userId;
        return this.reservationsService.getUserReservations(userId);
}


    @ApiOperation({summary: 'Cancel previous reservation'})
    @Delete(':id')
    async cancel(@Req() req:any, @Param('id') id:string) {
        const userId = req.user?.id || req.user?.sub || req.user?.userId;
        await this.reservationsService.cancelReservation(userId, id);
        return { message: 'تم إلغاء الحجز بنجاح وإعادة المقعد المتاح' };    
    }
}
