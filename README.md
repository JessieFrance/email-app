# Cope Notes Email App Backend

[![Actions Status](https://github.com/JessieFrance/cope-notes-email-app/workflows/Build%20and%20Test/badge.svg)](https://github.com/JessieFrance/cope-notes-email-app/actions)

This is the backend API for for an email scheduling application. This application lets users sign up, and receive ten automated, hardcoded emails (in random order) using [SendGrid](https://sendgrid.com/).

## How to Run the App

### Prerequisites

#### Docker, Node.jS, and NPM

In order to run this application, please make sure that you have [Docker](https://docs.docker.com/get-docker/), and [Docker Compose](https://docs.docker.com/compose/install/) installed on your local machine, as well as [Node.js and NPM](https://nodejs.org/en/) (both NPM and node.js are available by installing Node.js at that link).

#### Getting a SendGrid API Key

Next, please create a new test email address (Gmail, Yahoo, etc.) that will be used for sending the emails.

With the email address you have chosen, you need to sign up for a free [SendGrid](https://sendgrid.com) account, and generate your own API key. As part of this process, SendGrid will email you at your chosen address to make sure that you are the email owner. Do not share the SendGrid API key with anyone, and do not post your API key to GitHub. At the time of this writing, SendGrid allows free tier users to send up to 100 emails per day.

#### Create the `.env` File

Copy the `.env_sample` file in the root directory of this project to a new `.env`. Open the `.env` file, and change `EMAIL_FROM` and `SENDGRID_KEY` to your chosen email, and corresponding SendGrid API key from the values you obtained in the previous step. You can optionally change the "POSTGRES" user and password variables (or just keep them, since this is not in production). If you want to use the [frontend user interface](https://github.com/JessieFrance/cope-notes-frontend), then do not change the `PORT` or `ORIGIN` variables.

### Running the Application

After completing the prerequisites above, you should be ready to run the application in three steps: 

1. Install dependencies with `npm ci`.

2. Start the development and test databases with `docker-compose up -d`. This creates two Docker containers named `postgres` and `postgres-test` which are both initialized with ten hardcoded email messages at startup. If you get any errors at this step, please check that (A) you have correctly installed Docker and Docker Compose, and (B) you do not have a firewall or some other process blocking ports 5433 and 5434 (or whatever ports you have chosen in `.env`).

3. Run the application with `npm run dev`. You can also (in another terminal) test the application with `npm test`.

### Using the Application

The application contains a single POST `/signup` API endpoint that requires a valid email (with a maximum length of 30 characters) and a password (that must range from 2 to 20 characters). To sign up a user (and receive the ten hardcoded emails in random order), you can use the [frontend user interface](https://github.com/JessieFrance/cope-notes-frontend). Alternatively, you can use a tool like [Postman](https://www.postman.com/) or *cURL*.


#### Postman

To use the API with Postman, add a new tab to make a POST request to `localhost:5000/signup`. In the `Body` tab, select `raw` and `JSON`. Then add some JSON like this
```
{
    "email": "your_email@somedomain.com",
    "password": "your_password"
}
```

#### cURL

If instead you wish to use *cURL*, then inside the Linux or Mac terminal, you can type the following command (replacing the email and password with the user you want to sign up):

```
curl --location --request POST 'localhost:5000/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "your_email@somedomain.com",
    "password": "your_password"
}'
```

### A Note on Receiving Emails

Gmail and other email providers might mark the automated emails as spam. If you are not finding any emails in your inbox, please check the spam, promotions, or all emails folders. If you see any errors in the terminal about emails not sending, make sure you do not have a firewall blocking outgoing messages from the application on your machine.

### Important Note on Re-running the Application

If you stop and restart the application, Docker will still persist the email data (i.e. you cannot sign up again with the same email). If you want to refresh the data, then you may need to delete the Docker containers and their corresponding volumes. On a Mac or PC, you can run the Bash script `refresh-docker.sh` **but this will delete all Docker containers and volumes on your computer**.
