import { pool } from '../app';

/* Class that relates account to message */
class AccountMessageTable {
  /**
   * Stores an account message.
   *
   * @param accountId - Account id
   * @param messageId - Message id
   * @param used - Boolean that says if message has been used or not
   * @returns - Promise<void>.
   *
   */
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

  /**
   * Updates an account message used status
   *
   * @param accountId - Account id
   * @param messageId - Message id
   * @param used - Boolean that says if message has been used or not
   * @returns - Promise<void>.
   *
   */
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

  /**
   * Retrieves account messages
   * @remarks
   * Need to validate return type is account message array
   *
   * @param accountId - Account id
   * @param messageId - Message id
   * @param used - Boolean that says if message has been used or not
   * @returns - Promise<unknown>. An account message array from the database
   *
   */
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

  /**
   * Retrieves filtered account messages
   * @remarks
   * Need to validate return type is account message array
   *
   * @param accountId - Account id
   * @param used - Boolean that says if message has been used or not
   * @returns - Promise<unknown>. An account message array from the database
   *
   */
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

  /**
   * Deletes an account message by account id
   *
   * @param accountId - Account id
   * @returns - Promise<void>.
   *
   */
  static deleteByAccountId({ accountId }: { accountId: string }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM account_message WHERE account_id=$1`,
        [accountId],
        (error: any, response: any) => {
          if (error) return reject(error);
          return resolve({ users: response.rows });
        }
      );
    });
  }
}

export default AccountMessageTable;
