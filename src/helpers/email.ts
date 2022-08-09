/* eslint-disable class-methods-use-this */
import sgMail from '@sendgrid/mail';

/*  Wrapper class for sendgrid. */
class Email {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async sendEmail({
    from,
    to,
    subject,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      await sgMail.send({ from, to, subject, html });
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error(`Error sending email to ${to}: ${errorMessage}`);
    }
  }
}

export default Email;
