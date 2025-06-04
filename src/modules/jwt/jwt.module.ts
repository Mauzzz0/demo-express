import { Container } from 'inversify';
import { JwtService } from './jwt.service';

const JwtModule = new Container();

JwtModule.bind(JwtService).toSelf().inSingletonScope();

export default JwtModule;
