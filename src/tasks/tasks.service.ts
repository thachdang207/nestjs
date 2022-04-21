import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { User } from "../auth/user.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepository: TasksRepository,
  ) {}

  getTasks(filter: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getFilteredTasks(filter);
  }

  getTaskById(id: string): Promise<Task> {
    return this.taskRepository.getTaskById(id);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  deleteTask(taskId: string): Promise<boolean> {
    return this.taskRepository.deleteTaskById(taskId);
  }

  updateTaskStatus(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskRepository.updateTaskById(taskId, updateTaskDto);
  }
}
