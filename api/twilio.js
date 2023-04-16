// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

module.exports = {
    sentOtp: (mobileNo) => {
        console.log(mobileNo);
        return new Promise((resolve, reject) => {
            client.verify.v2.services(serviceSid)
                .verifications
                .create({
                    to: '+91' + mobileNo,
                    channel: 'sms'
                })
                .then((verification) => {
                    console.log(verification);
                    resolve(verification.sid)
                });
        })
    },

    verifyOtp: (mobileNo, otp) => {
        return new Promise((resolve, reject) => {
            client.verify.v2.services(serviceSid)
                .verificationChecks
                .create({
                    to: '+91'+mobileNo,
                    code: otp
                })
                .then((verification)=> {
                    console.log(verification.status);
                    resolve(verification.valid)
                });
        })
    }
}