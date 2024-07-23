import { IsEnum, IsNumber, IsString } from 'class-validator';

import { PaginationDto } from '../shared/pagination.dto';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  assigneeId: number;
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
