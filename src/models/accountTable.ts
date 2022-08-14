import { pool } from '../app';

/* Class for account */
class AccountTable {
  /**
   * Stores an account.
   *
   * @param email - account email
   * @param hashedPassword - hashed password
   * @returns - Promise<string>. id of stored account
   *
   */
  static storeAccount({
    email,
    hashedPassword,
  }: {
    email: string;
    hashedPassword: string;
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO account (email, hashed_password) VALUES($1, $2) RETURNING id`,
        [email, hashedPassword],
        (error: any, response: any) => {
          if (error) return reject(error);
          const { rows } = response;
          if (
            !rows ||
            !Array.isArray(rows) ||
            !rows.length ||
            !('id' in rows[0])
          )
            return reject(new Error('unable to store account'));
          const { id } = response.rows[0];
          return resolve({ accountId: id.toString() });
        }
      );
    });
  }

  /**
   * Retrieves an account by email
   *
   * @param email - account email
   * @returns - Promise<unknown>. An account
   *
   */
  static getAccount({ email }: { email: string }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, email, hashed_password FROM account WHERE email = $1`,
        [email],
        (error: any, response: any) => {
          if (error) return reject(error);
          return resolve(response.rows[0]);
        }
      );
    });
  }

  /**
   * Retrieves an array of accounts, containing only email (and id) field
   *
   * @returns - Promise<unknown>. An array of account
   *
   */
  static getAccountEmails() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, email FROM account`,
        (error: any, response: any) => {
          if (error) return reject(error);
          return resolve({ users: response.rows });
        }
      );
    });
  }

  /**
   * Deletes an account by id
   *
   * @param id - Account id
   * @returns - Promise<void>.
   *
   */
  static deleteById({ id }: { id: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM account WHERE id=$1`, [id], (error: any) => {
        if (error) return reject(error);
        return resolve();
      });
    });
  }
}

export default AccountTable;
