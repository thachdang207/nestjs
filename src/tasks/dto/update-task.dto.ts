import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @MaxLength(2000)
  description?: string;
}
