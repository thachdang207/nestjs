import { EntityRepository, Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from "../auth/user.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getFilteredTasks(filter: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filter;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }
    return await query.getMany();
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = this.create({
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      return await this.findOneOrFail({ id });
    } catch (e) {
      throw new NotFoundException(`tasks with ${id} not found`);
    }
  }

  async deleteTaskById(id: string): Promise<boolean> {
    await this.getTaskById(id);
    try {
      await this.delete(id);
      return;
    } catch (e) {
      throw new HttpException(
        'Please check again after 5 minutes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTaskById(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.getTaskById(id);
    try {
      task.title = updateTaskDto.title || task.title;
      task.status = updateTaskDto.status || task.status;
      task.description = updateTaskDto.description || task.description;
      await this.update(id, task);
      return task;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
