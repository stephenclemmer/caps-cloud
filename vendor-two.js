/* This code is using the AWS SDK to publish a message to an SNS topic and listen for messages on an
SQS queue. The SNS message contains information about a vendor pickup request, while the SQS queue
is used to receive messages about the delivery status of the pickup. The code is also using the
`chance` library to generate a unique ID for the SNS message and the `sqs-consumer` library to
create a consumer for the SQS queue. The `use strict` statement at the beginning of the code enables
strict mode, which enforces stricter rules for JavaScript syntax and behavior. */

'use strict';

/* This code is importing the necessary libraries and configuring the AWS SDK to interact with AWS
services in the `us-west-2` region. It is also creating an SNS client and defining the topic to
which a message will be published. Additionally, it is using the `Chance` library to generate a
unique ID for the SNS message. */
const AWS = require('aws-sdk');
// const { Consumer } = require('sqs-consumer');
// const { Producer } = require('sqs-producer');
const Chance = require('chance');
const chance = new Chance();


AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS();
const topic = 'arn:aws:sns:us-west-2:978126511751:pickups.fifo';

/* The comment is explaining that AWS has a specific preference for the case of the keys in the
`payload` object. The keys `Message`, `TopicArn`, `MessageGroupId`, and `MessageDeduplicationId` are
all written in uppercase letters to match AWS's preference. The `payload` object is used to define
the message that will be published to the SNS topic. The `Message` key contains the actual message
content, while the `TopicArn` key specifies the ARN (Amazon Resource Name) of the SNS topic to which
the message will be published. The `MessageGroupId` key is used to group related messages together,
while the `MessageDeduplicationId` key is used to ensure that duplicate messages are not sent to the
topic. The `chance.guid()` method is used to generate a unique ID for the `MessageDeduplicationId`
key. */

// AWS is opinionated about the case in the following payload:
const payload = {
  Message: 'VENDOR TWO PICK UP NEEDED',
  TopicArn: topic,
  MessageGroupId: 'VENDORTWOgroup1234',
  MessageDeduplicationId: chance.guid(), // typically a hash of the message body
};

/* `sns.publish(payload).promise()` is publishing a message to the SNS topic specified in the `payload`
object. The `promise()` method returns a promise that resolves with the message ID of the published
message. The `then()` method is used to handle the resolved promise and logs the message ID to the
console. The `catch()` method is used to handle any errors that may occur during the publishing
process and logs the error to the console. */
sns.publish(payload).promise()
  .then(data => console.log(data))
  .catch(err => console.log(err));


// Listen for the intransit message
const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/978126511751/delivery-status-two',
  handleMessage: async (data) => {
    // do some work with `message`
    console.log(data);
  },
});


app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();
