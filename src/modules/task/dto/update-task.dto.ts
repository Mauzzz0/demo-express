import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskSeverity } from '../../../database';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskSeverity)
  @IsOptional()
  severity?: TaskSeverity;

  @IsNumber()
  @IsOptional()
  assigneeId?: number;
}
