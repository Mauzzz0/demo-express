/**
 * Напишите функцию checkAccess, которая получает на вход роль и проверяемые пермишен, и возвращает true или false
 * Функция проверяет, имеет ли эта роль требуемое разрешение
 * Ваша функция должна быть рекурсивной, а значит не привязываться к конкретно этому дереву, она должна работать
 * и для других возможных деревьев.
 *
 * Ваша функция должна сначала проверять, есть ли запрашиваемый пермишен внутри самой роли, если нет, то рекурсивно
 * вызывать эту же проверку для каждой родительской роли. Если в родительской роли не найдено пермшена, то рекурсивно
 * вызывать эту же проверку для "родительской роли родительской роли" и так далее, пока не найдётся пермишен или пока
 * не закончится дерево и все родительские роли.
 *
 * Ролевая система представлена в виде дерева.
 * Это значит, что, например, роль Owner имеет свои пермишены, плюс имеет все пермишены из роли Administrator.
 * В свою очередь, Administrator имеет свои пермишены, и плюс все из ролей Marketing, Analytic и Manager.
 * Далее, Manager имеет свои пермишены, плюс все пермишены из Client
 * И так далее...
 *
 * Например, пользователь спрашивает, может ли роль Owner выполнять view-catalog.
 * Конкретный порядок работы может быть другой, но смысл должен остаться тот же:
 * 1. Сначала проверяем есть ли пермишен view-catalog у самого Owner - такого пермишена нет
 * 2. Проверяем родительскую роль Administator - есть ли там такой пермишен? - Нет!
 * 3. Проверяем родительскую роль администратора - Marketing - есть ли в ней такой пермишен? - Нет!
 * 4. Проверяем родительскую роль маркетинга - Guest - есть ли в ней такой пермишен? - Да!
 * А значит что Owner имеет пермишен view-catalog, потому что этот пермишен доступен по такой цепочке:
 * Guest -> Marketing -> Administrator -> Owner
 * Повторюсь, конкретный порядок или цепочка может быть другой, например Guest -> Analytic -> Administrator -> Owner,
 * важно, чтобы была сама рекурсивная логика поиска.
 */

enum Role {
  guest = 'guest',
  marketing = 'marketing',
  analytic = 'analytic',
  client = 'client',
  manager = 'manager',
  administrator = 'administrator',
  systemAdministrator = 'systemAdministrator',
  owner = 'owner',
}

type Permission = {
  role: Role;
  permissions: string[];
  parents?: Permission[];
};

const guest: Permission = {
  role: Role.guest,
  permissions: ['view-catalog'],
};

const client: Permission = {
  role: Role.client,
  permissions: ['make-basket', 'buy-order'],
  parents: [guest],
};

const marketing: Permission = {
  role: Role.marketing,
  permissions: ['see-orders', 'see-users'],
  parents: [guest],
};

const analytic: Permission = {
  role: Role.analytic,
  permissions: ['see-orders'],
  parents: [guest],
};

const manager: Permission = {
  role: Role.manager,
  permissions: ['see-orders', 'see-users', 'change-catalog'],
  parents: [client],
};

const systemAdministrator: Permission = {
  role: Role.systemAdministrator,
  permissions: ['change-database'],
};

const administrator: Permission = {
  role: Role.administrator,
  permissions: ['change-roles'],
  parents: [manager, analytic, marketing],
};

const owner: Permission = {
  role: Role.owner,
  permissions: ['change-roles'],
  parents: [administrator, systemAdministrator],
};

/**
 * Все эти логи ниже должны показать true!
 */
console.log(checkAccess(guest, 'view-catalog') === true);
console.log(checkAccess(owner, 'view-catalog') === true);
console.log(checkAccess(administrator, 'view-catalog') === true);
console.log(checkAccess(systemAdministrator, 'view-catalog') === false);

console.log(checkAccess(analytic, 'make-basket') === false);
console.log(checkAccess(marketing, 'make-basket') === false);
console.log(checkAccess(client, 'make-basket') === true);
console.log(checkAccess(client, 'make-basket') === true);

console.log(checkAccess(client, 'change-roles') === false);
console.log(checkAccess(guest, 'change-roles') === false);
console.log(checkAccess(administrator, 'change-roles') === false);
console.log(checkAccess(systemAdministrator, 'change-roles') === false);
console.log(checkAccess(owner, 'change-roles') === true);

console.log(checkAccess(owner, 'see-orders') === true);
console.log(checkAccess(administrator, 'see-orders') === true);

console.log(checkAccess(owner, 'buy-order') === true);
console.log(checkAccess(administrator, 'buy-order') === true);
console.log(checkAccess(manager, 'buy-order') === true);
console.log(checkAccess(analytic, 'buy-order') === false);
