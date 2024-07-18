import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateTask {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class Task extends CreateTask {
  id: number;
}

export enum TaskSortEnum {
  id = 'id',
  title = 'title',
  description = 'description',
}

export class PaginationAndSortingDto {
  @IsNumber()
  limit: number = 10;

  @IsNumber()
  offset: number = 0;

  @IsEnum(TaskSortEnum)
  sort: TaskSortEnum = TaskSortEnum.id;
}
