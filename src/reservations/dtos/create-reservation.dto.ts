import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";



export class CreateReservationDto {
    @ApiProperty({ example: 'uuid-seminar-id-here', description: 'معرف الندوة المراد حجزها' })
    @IsUUID()
    @IsNotEmpty()
    seminarId:string;
}