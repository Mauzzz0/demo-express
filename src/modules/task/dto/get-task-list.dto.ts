import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto, SortDirection } from '../../../shared';

export enum TaskSortByEnum {
  id = 'id',
  title = 'title',
  description = 'description',
}

export class GetTaskListDto extends PaginationDto {
  @IsEnum(TaskSortByEnum)
  @IsOptional()
  sortBy: TaskSortByEnum = TaskSortByEnum.id;

  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection: SortDirection = SortDirection.asc;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  assigneeId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  authorId?: number;
}
