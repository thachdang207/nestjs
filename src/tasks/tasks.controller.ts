import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  @Get()
  getAllTasks(@Query() filter: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filter);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get(':id')
  async getTaskById(@Param('id') taskId: string): Promise<Task> {
    return await this.tasksService.getTaskById(taskId);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') taskId: string): Promise<boolean> {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch('/:id')
  updateTaskStatus(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, updateTaskDto);
  }
}
