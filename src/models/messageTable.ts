import { pool } from '../app';

class MessageTable {
  static getMessages() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM message`, (error: any, response: any) => {
        if (error) console.log(error);
        if (error) return reject(error);
        console.log('inside table function', response.rows);
        return resolve({ messages: response.rows });
      });
    });
  }
}

export default MessageTable;
