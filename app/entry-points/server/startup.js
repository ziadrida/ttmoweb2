import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

Meteor.startup(() => {
  console.log('[server] startup');

  // Set html lang attribute
  WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));

  // Setup email provider
  const { protocol, username, password, server, port } = Meteor.settings.smtp;
  console.log('email provider:',`${protocol}://${username}:${password}@${server}:${port}`)
  process.env.MAIL_URL = `${protocol}://${username}:${password}@${server}:${port}`;

  // Setup default users if any
  import './fixtures';

  // Run schema migrations if any.

  // Start cron-jobs if any
});
