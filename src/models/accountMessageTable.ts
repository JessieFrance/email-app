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
    id,
    used,
  }: {
    id: string;
    used: boolean;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE account_message SET used = $2
         WHERE id = $1`,
        [id, used],
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
}

export default AccountMessageTable;
