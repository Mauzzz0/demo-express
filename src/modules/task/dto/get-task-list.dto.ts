import { IsEnum } from 'class-validator';
import { PaginationDto } from '../../../shared';

export enum TaskSortEnum {
  id = 'id',
  title = 'title',
  description = 'description',
}

export class GetTaskListDto extends PaginationDto {
  @IsEnum(TaskSortEnum)
  sort: TaskSortEnum = TaskSortEnum.id;
}
