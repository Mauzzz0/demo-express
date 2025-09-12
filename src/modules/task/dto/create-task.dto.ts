import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskSeverity } from '../../../database';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskSeverity)
  @IsOptional()
  severity?: TaskSeverity;

  @IsNumber()
  @IsOptional()
  assigneeId?: number;
}
