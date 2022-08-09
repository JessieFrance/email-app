import { pool } from '../app';

class AccountTable {
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
}

export default AccountTable;
