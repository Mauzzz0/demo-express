import * as fs from 'fs';
import { LoginDto, User } from './user.types';

let storage: User[] = [];
const filename = 'database_users.json';
const saveDatabaseToFile = () =>
  fs.writeFileSync(filename, JSON.stringify(storage));
const extractId = ({ id }: { id: number }) => id;
const sortByDesc = (a: any, b: any) => (a < b ? 1 : -1);

if (fs.existsSync(filename)) {
  storage = JSON.parse(fs.readFileSync(filename, 'utf-8'));
} else {
  saveDatabaseToFile();
}

export const userRepository = {
  findByNick(nick: User['nick']): User | undefined {
    return storage.find((item) => item.nick === nick);
  },

  findById(id: User['id']): User | undefined {
    return storage.find((item) => item.id === id);
  },

  save(dto: LoginDto) {
    const maxId = storage.map(extractId).sort(sortByDesc)[0] ?? 0;

    return storage.push({ id: maxId, ...dto });
  },
};
