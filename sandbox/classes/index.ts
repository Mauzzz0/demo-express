/**
 * Реализуйте два класса - User и Task для работы с задачами.
 *
 * === User ===
 * Этот класс должен имплементить интерфейсы IUser и TaskManagement.
 * При создании нового инстанса класса, в конструкторе в качестве id должен генерироваться новый nanoid длиной 3.
 * У каждого пользователя должен быть список его задач (Это композиция. Если вы не понимаете этого слова, то повторите тему ООП).
 *
 * Метод info() пользователя используется, чтобы пользователь мог "представиться", метод должен выводить в консоль следующее:
 * [a6C] Моё имя - Max
 *
 * Здесь:
 * a6C - рандомно сгенерированный id пользователя, у вас он будет другой.
 *
 * == createNewTask
 * У пользователя должен быть метод createNewTask, который принимает на вход id автора, название и описании задачи,
 * затем создаёт новую задачу, сохраняет её в свой массив и возвращает id только что созданной задачи.
 *
 *
 * == getTaskById
 * У пользователя должен быть метод getTaskById, с помощью которого можно по id найти задачу пользователя.
 * Если такой задачи у пользователя нет, должен быть кинута ошибка с сообщением "Task with id XXX not found", где XXX - полученный id.
 * Если такая задача есть, то должна вернуться найденная задача.
 *
 * == markTaskAsDone
 * У пользователя должен быть метод markTaskAsDone, с помощью которого можно по id найти задачу пользователя, и затем
 * пометить её как выполненную, используя соответствующий метод у задачи.
 *
 *
 * === Task ===
 * Этот класс должен имплементить интерфейсы ITask и Informative
 * При создании нового инстанса класса, в конструкторе в качестве id должен генерироваться новый nanoid длиной 3.
 * При создании нового инстанса класса, в ready всегда указывается false.
 *
 * Метод info() задачи используется, чтобы узнать информацию о задаче, метод должен выводить в консоль следующее:
 * [sWk] (Не выполнена) Задача: Покупки. Описание: Молоко и хлеб. Автор: a6C
 *
 * Здесь:
 * (Не выполнена) - информация выполнена задача или нет.
 * Покупки - название задачи.
 * Молоко и хлеб - описание задачи.
 * sWk - рандомно сгенерированный id пользователя, у вас он будет другой.
 * a6C - id автора, создателя задачи
 *
 *
 * Так же у задачи должны быть поля:
 * title - название
 * description - описание
 * ready - выполнена она или нет
 *
 * Поле ready приватное, чтение идет через метод isDone(), а изменение через метод markAsDone().
 */

import { nanoid } from 'nanoid';

interface Informative {
  info(): void;
}

interface StringID {
  id: string;
}

interface IUser extends StringID {
  info(): void;
}

interface ITask extends StringID {
  userId: IUser['id'];
  isDone(): boolean;
  markAsDone(): void;
}

interface TaskManagement {
  getTaskById(taskId: Task['id']): Task;
  createNewTask(task: Pick<Task, 'title' | 'description'>): Task['id'];
  markTaskAsDone(taskId: Task['id']): void;
}

class User implements IUser, TaskManagement {
  public readonly id: string;

  private readonly tasks: Task[] = [];

  constructor(private readonly name: string) {
    this.id = nanoid(3);
  }

  info() {
    console.log(`[${this.id}] Моё имя - ${this.name}`);
  }

  getTaskById(taskId: Task['id']): Task {
    const task = this.tasks.find((task) => task.id === taskId);
    if (!task) {
      throw Error(`Task with id ${taskId} not found`);
    }

    return task;
  }

  createNewTask(task: Pick<Task, 'title' | 'description'>) {
    const newTask = new Task(this.id, task.title, task.description);

    this.tasks.push(newTask);

    return newTask.id;
  }

  markTaskAsDone(taskId: Task['id']) {
    const task = this.getTaskById(taskId);

    task.markAsDone();
  }
}

class Task implements ITask, Informative {
  public readonly id: string;
  private ready: boolean;

  constructor(
    public readonly userId: User['id'],
    public readonly title: string,
    public readonly description: string,
  ) {
    this.ready = false;
    this.id = nanoid(3);
  }

  isDone() {
    return this.ready;
  }

  markAsDone() {
    this.ready = true;
  }

  info() {
    console.log(
      `[${this.id}] (${this.ready ? 'Выполнена' : 'Не выполнена'}) Задача: ${this.title}. Описание: ${this.description}. Автор: ${this.userId}`,
    );
  }
}

const max = new User('Max');
max.info(); // [a6C] Моё имя - Max

const task1Id = max.createNewTask({ title: 'Покупки', description: 'Молоко и хлеб' });
const task1 = max.getTaskById(task1Id);
task1.info(); // [sWk] (Не выполнена) Задача: Покупки. Описание: Молоко и хлеб. Автор: a6C

const task2Id = max.createNewTask({ title: 'Вещи', description: 'Погладить штаны' });
const task2 = max.getTaskById(task2Id);
console.log(task2.isDone()); // false
max.markTaskAsDone(task2.id);
task2.info(); // [UQV] (Выполнена) Задача: Вещи. Описание: Погладить штаны. Автор: a6C

const alex = new User('Alex');
alex.info(); // [Wkt] Моё имя - Alex

const badTaskId = 'XXX';
try {
  alex.getTaskById(badTaskId);
} catch (e: any) {
  console.log('Произошла ошибка', e.message); // Произошла ошибка Task with id XXX not found
}
