import { app, PORT, SENDGRID_KEY } from './app';
import EmailSchedule from './helpers/scheduleMail';

// Start the email scheduler.
const emailSchedule = new EmailSchedule(String(SENDGRID_KEY));
emailSchedule.start();

// Start the Express application.
app.listen(PORT || 8888, () => {
  console.log(`Server running on port ${PORT || 8888}`);
});
