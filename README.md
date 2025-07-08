# Mailer Module For Nest.js

This mailer module is using [resend](https://resend.com/) API to send emails. It also support create email templates and store to database

## Installation

```bash
npm install @ploutos/mailer
```

## Variables
```dotenv
RESEND_API_KEY=sdfsdfsdfsdfsdf
MAIL_FROM=no_reply@domain.com
MAIL_REPLY_TO=pm@gmail.com
```
## Usage
```typescript
import { MailerModule } from '@ploutos/mailer';

@Module({
  imports: [MailerModule.forRoot()]
})
export class AppModule {}
```
## Notes
***RESEND_API_KEY*** & ***MAIL_FROM*** variables are required.	
