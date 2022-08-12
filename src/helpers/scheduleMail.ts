import { CronJob } from 'cron';
import { EMAIL_FREQUENCY } from '../constants';
import AccountTable from '../models/accountTable';
import AccountMessageTable from '../models/accountMessageTable';
import Email from './email';
import MessageTable from '../models/messageTable';
import { EMAIL_FROM } from '../app';

interface User {
  id: string | number;
  email: string;
}

// This interface uses snake casing because of SQL convention.
// Should update SQL to use camel casing here...
interface AccountMessage {
  account_id: number;
  message_id: number;
  used: boolean;
}

interface Message {
  id: number;
  subject: string;
  content: string;
}

const isUser = (item: any): item is User => {
  if (item && item.id && item.email) {
    const { id, email } = item;
    if (typeof id === 'string' || typeof id === 'number') {
      return typeof email === 'string';
    }
  }
  return false;
};

const isAccountMessage = (item: any): item is AccountMessage => {
  if (item && item.account_id && item.message_id && 'used' in item) {
    const { account_id, message_id, used } = item;
    // console.log('account_id type: ', typeof account_id);
    // console.log('message_id type: ', typeof message_id);
    // console.log('used type: ', typeof used);

    return (
      typeof account_id === 'number' &&
      typeof message_id === 'number' &&
      typeof used === 'boolean'
    );
  }
  console.log('i am here');
  return false;
};

const isMessage = (item: any): item is Message => {
  if (item && item.id && item.subject && item.content) {
    const { id, subject, content } = item;
    return (
      typeof id === 'number' &&
      typeof subject === 'string' &&
      typeof content === 'string'
    );
  }
  return false;
};

/* Returns true if arr is an empty array or if all items are of type User */
const isUserArray = (arr: any): arr is User[] =>
  Array.isArray(arr) && arr.every((item) => isUser(item));
/* Returns true if arr is an empty array or if all items are of type AcccountMessage */
const isAccountMessageArray = (arr: any): arr is AccountMessage[] =>
  Array.isArray(arr) && arr.every((item) => isAccountMessage(item));
/* Returns true if arr is an empty array or if all items are of type Message */
const isMessageArray = (arr: any): arr is Message[] =>
  Array.isArray(arr) && arr.every((item) => isMessage(item));

const loadMessages = async () => {
  const { messages } = (await MessageTable.getMessages()) as any;
  return isMessageArray(messages) ? messages : [];
};

class EmailSchedule {
  cronJob: CronJob;

  messages: Message[];

  email: Email;

  constructor(apiKey: string) {
    this.cronJob = new CronJob(`*/${EMAIL_FREQUENCY} * * * * *`, async () => {
      try {
        await this.sendEmails();
      } catch (e) {
        console.error(e);
      }
    });

    // Since there are a small number of messages, we can
    // just load them into memory.
    this.messages = [];

    // Create class instance for sending email
    // using the API key.
    this.email = new Email(apiKey);
  }

  async start(): Promise<void> {
    this.messages = await loadMessages();
    // Start cron job.
    if (!this.cronJob.running) {
      this.cronJob.start();
    }
  }

  async sendEmails(): Promise<void> {
    console.log('messages are: ', this.messages);
    const { users } = (await AccountTable.getAccountEmails()) as any;

    // Type check....
    if (!isUserArray(users)) return;

    // Iterate over users.
    for (const user of users) {
      // Get a list of unsent messages for this user.
      const { accountMessages } =
        (await AccountMessageTable.getFilteredAccountMessages({
          accountId: user.id.toString(),
          used: false,
        })) as any;
      // Check type and array lenght.
      if (!isAccountMessageArray(accountMessages)) continue;
      if (!accountMessages.length) continue;

      // Select random account message.
      // TODO: check on adding a seed to the random number generator.
      const randomAccountMessage =
        accountMessages[Math.floor(Math.random() * accountMessages.length)];

      // Retrieve the corresponding message.
      const msg = this.messages.find(
        (ele) => ele.id === randomAccountMessage.message_id
      );
      if (!msg) continue;

      // Get email content.
      const { subject, content } = msg;
      const { email } = user;
      const html = `<p>${content}</p>`;
      const from = String(EMAIL_FROM);

      // Send email.
      // Nice to have: Although I catch errors in the send mail function,
      // could catch/should them here to and mark an email address as invalid if
      // it gets a bad request error.
      await this.email.sendEmail({ from, to: email, subject, html });

      // Update accountMessage since message has been sent.
      try {
        await AccountMessageTable.updateUsed({
          accountId: user.id.toString(),
          messageId: msg.id.toString(),
          used: true,
        });
      } catch (error) {
        console.error(
          `Problem updating account message table to used true status.`
        );
      }
    }
  }
}

export default EmailSchedule;
