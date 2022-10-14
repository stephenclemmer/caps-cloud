'use strict';

const AWS = require('aws-sdk');
// const { Consumer } = require('sqs-consumer');
// const { Producer } = require('sqs-producer');
const Chance = require('chance');
const chance = new Chance();


AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS();
const topic = 'arn:aws:sns:us-west-2:978126511751:pickups.fifo';

// AWS is opinionated about the case in the following payload:
const payload = {
  Message: 'VENDOR TWO PICK UP NEEDED',
  TopicArn: topic,
  MessageGroupId: 'VENDORTWOgroup1234',
  MessageDeduplicationId: chance.guid(), // typically a hash of the message body
};

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
