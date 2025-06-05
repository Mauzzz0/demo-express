import { Container } from 'inversify';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

const DepartmentModule = new Container();

DepartmentModule.bind(DepartmentService).toSelf().inSingletonScope();
DepartmentModule.bind(DepartmentController).toSelf().inSingletonScope();

export default DepartmentModule;
