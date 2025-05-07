import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskSeverity } from '../../database/models';
import { PaginationDto } from '../../shared/pagination.dto';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskSeverity)
  @IsOptional()
  severity?: TaskSeverity;

  @IsNumber()
  assigneeId: number;

  @IsEmail()
  email: string;
}

export enum TaskSortEnum {
  id = 'id',
  title = 'title',
  description = 'description',
}

export class GetTaskListDto extends PaginationDto {
  @IsEnum(TaskSortEnum)
  sort: TaskSortEnum = TaskSortEnum.id;
}
