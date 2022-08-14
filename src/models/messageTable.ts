import { pool } from '../app';

/* Class that relates account to message */
class MessageTable {
  /**
   * Retrieves messages
   * @remarks
   * Need to validate return type is message array
   *
   * @returns - Promise<unknown>. A message array from the database
   *
   */
  static getMessages() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM message`, (error: any, response: any) => {
        if (error) return reject(error);
        return resolve({ messages: response.rows });
      });
    });
  }
}

export default MessageTable;
