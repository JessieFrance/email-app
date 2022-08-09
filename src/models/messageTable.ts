import { pool } from '../app';

class MessageTable {
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
