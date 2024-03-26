type Program = {
  name: string;
};

type Person = {
  age?: number;
  name?: string;
  nicknames: string[];
  programs: Program[];
};

const logProgramName = (object: Program): string => {
  console.log(object.name);
};

const logPersonName = (object: Person): string => {
  return object.name;
};

const pro: Program = { name: 'programmator' };
const per: Person = {
  nicknames: [],
  programs: [pro],
};

console.log(logProgramName(pro));
console.log(logPersonName(per));

console.log(logProgramName(per));
console.log(logPersonName(pro));
