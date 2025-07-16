import { QueryInterface, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Tables } from '../dictionary';
import { wrapWithTransaction } from '../transaction-wrapper';

module.exports = {
  up: wrapWithTransaction(
    async (transaction: Transaction, queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> => {
      return queryInterface.createTable(Tables.users, {}, { transaction });
    },
  ),

  down: wrapWithTransaction(
    async (transaction: Transaction, queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> => {
      return queryInterface.dropTable(Tables.users, { transaction });
    },
  ),
};
