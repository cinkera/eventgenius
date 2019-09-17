/* Script for sending emails to the users */

const AWS = require('aws-sdk');

const config = require('./config'); // load configurations file
const SOURCEEMAILADDRESS = 'eventgeniusnotifier@gmail.com';

AWS.config.update({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret,
    region: config.aws.ses.region
});

const ses = new AWS.SES({apiVersion: '2010-12-01'});

const sendEmail = (to, subject, message, from) => {
    const params = {
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: message
                },
                /* replace Html attribute with the following if you want to send plain text emails. 
                Text: {
                    Charset: "UTF-8",
                    Data: message
                }
             */
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        ReturnPath: from ? from : config.aws.ses.from.default,
        Source: from ? from : config.aws.ses.from.default,
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            return console.log(err, err.stack);
        } else {
            console.log("Email sent.", data);
        }
    });
};

module.exports = {sendEmail};

/*
function sendThankyouEmail(firstname, lastname, emailaddy) {
    console.log("... \nin function sendThankYouEmail");
    // Create sendEmail params 
    var params = {
        Destination: { /* required 
        CcAddresses: [
            /* 'EMAIL_ADDRESS', more items 
        ],
        ToAddresses: [
            emailaddy /* the user who signed up, this is their email 
            /* more items 
        ]
        },
        Message: { /* required 
        Body: { /* required 
            Html: {
            Charset: "UTF-8",
            Data: "HTML_FORMAT_BODY"
            },
            Text: {
            Charset: "UTF-8",
            Data: "Thank you for signing up for the event genius notifier! We will send you development updates and information about the release! You can also send your input on what you would like to see in Event Genius to our devlopement team! Just reply to this email with subject {USER INPUT} and our development team will consider your input!"
            }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'Thank you, you have signed up for Event Genius Notifier!'
            }
        },
        Source: SOURCEEMAILADDRESS, /* required, sender address 
        ReplyToAddresses: [
            SOURCEEMAILADDRESS
        /* more items 
        ]
    };
    
    // Create the promise and SES service object
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    console.log("... promise sent");
    
    // Handle promise's fulfilled/rejected states
    sendPromise.then(
        function(data) {
            console.log("... promise fulfilled");
            console.log(data.MessageId);
        }).catch(
        function(err) {
            console.log("... promise rejected");
            console.error(err, err.stack);
        });
}
*/
