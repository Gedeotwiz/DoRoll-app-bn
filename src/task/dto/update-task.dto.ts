import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateTaskDto } from "./task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto){
    
    @ApiProperty()
    status:string
}