import * as fs from 'fs';
import { User } from './user.types';

let storage: User[] = [];
const filename = 'database_users.json';
const saveDatabaseToFile = () =>
  fs.writeFileSync(filename, JSON.stringify(storage));

if (fs.existsSync(filename)) {
  storage = JSON.parse(fs.readFileSync(filename, 'utf-8'));
} else {
  saveDatabaseToFile();
}

export const userRepository = {
  get size() {
    return storage.length;
  },

  findByNick(nick: User['nick']): User | undefined {
    return storage.find((item) => item.nick === nick);
  },

  findById(id: User['id']): User | undefined {
    return storage.find((item) => item.id === id);
  },
};
