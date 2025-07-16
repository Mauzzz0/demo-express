import { QueryInterface, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

type MigrationFn = (transaction: Transaction, queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;

export const wrapWithTransaction = (migrationFn: MigrationFn) => {
  return async (queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await migrationFn(transaction, queryInterface, sequelize);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
};
