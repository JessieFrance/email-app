import { pool } from '../app';

class AccountMessageTable {
  static storeAccountMessage({
    accountId,
    messageId,
    used,
  }: {
    accountId: string;
    messageId: string;
    used: boolean;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO account_message (account_id, message_id, used) VALUES($1, $2, $3)`,
        [accountId, messageId, used],
        (error: any) => {
          if (error) return reject(error);
          return resolve();
        }
      );
    });
  }

  static updateUsed({
    accountId,
    messageId,
    used,
  }: {
    accountId: string;
    messageId: string;
    used: boolean;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE account_message SET used = $3
         WHERE account_id = $1 AND message_id = $2`,
        [accountId, messageId, used],
        (error: any) => {
          if (error) return reject(error);
          return resolve();
        }
      );
    });
  }

  static getAccountMessages() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM account_message`,
        (error: any, response: any) => {
          if (error) return reject(error);
          return resolve({ accountMessages: response.rows });
        }
      );
    });
  }

  static getFilteredAccountMessages({
    accountId,
    used,
  }: {
    accountId: string;
    used: boolean;
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT account_id, message_id, used FROM account_message WHERE account_id = $1 AND used = $2`,
        [accountId, used],
        (error: any, response: any) => {
          if (error) return reject(error);
          return resolve({ accountMessages: response.rows });
        }
      );
    });
  }
}

export default AccountMessageTable;
