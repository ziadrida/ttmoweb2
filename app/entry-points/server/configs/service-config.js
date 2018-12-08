import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

/**
* @see: {@link https://atmospherejs.com/meteor/service-configuration}
* @see: {@link http://guide.meteor.com/security.html#served-files}
*/
try {
const { secret } = Meteor.settings.facebook;
} catch(e) {
  console.log("cannot find secret in Meteor.settings.facebook")
}
try {
const { appId } = Meteor.settings.public.facebook;
} catch(e) {
  console.log("cannot find appId in Meteor.settings.facebook")
}
if(typeof appId !== 'undefined' && typeof secret !== 'undefined' ) {
ServiceConfiguration.configurations.upsert(
  { service: 'facebook' },
  // { $set: { appId, secret, loginStyle: 'redirect' } },
  { $set: { appId, secret, loginStyle: 'popup' } },
);
}
