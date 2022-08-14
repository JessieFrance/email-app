import { CronJob } from 'cron';
import { EMAIL_FREQUENCY } from '../constants';
import AccountTable from '../models/accountTable';
import AccountMessageTable from '../models/accountMessageTable';
import Email from './email';
import MessageTable from '../models/messageTable';
import { EMAIL_FROM } from '../app';
import {
  isAccountMessageArray,
  isMessageArray,
  isUserArray,
  Message,
} from './typeChecks';

/**
 * Loads messages from database.
 *
 * @returns - Promise<Message[]>. Promise that resolves with an array of messages form database.
 *
 */
const loadMessages = async () => {
  const { messages } = (await MessageTable.getMessages()) as any;
  return isMessageArray(messages) ? messages : [];
};

/* EmailSchedule class */
class EmailSchedule {
  cronJob: CronJob;

  messages: Message[];

  email: Email;

  /**
   * Initializes the email scheduler with the SendGrid key, and starts sending emails
   * using Linux style cron job.
   *
   * @param apiKey  - String for SendGrid key.
   * @returns - Promise<void>.
   *
   */
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

  /**
   * Starts the email scheduler
   *
   * @returns - Promise<void>.
   *
   */
  async start(): Promise<void> {
    this.messages = await loadMessages();
    // Start cron job.
    if (!this.cronJob.running) {
      this.cronJob.start();
    }
  }

  /**
   * Sends the emails
   *
   * @returns - Promise<void>.
   *
   */
  async sendEmails(): Promise<void> {
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
