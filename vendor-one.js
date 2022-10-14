'use strict';

const AWS = require('aws-sdk');
// const { Consumer } = require('sqs-consumer');
// const { Producer } = require('sqs-producer');
const Chance = require('chance');
const chance = new Chance();


AWS.config.update({region: 'us-west-2'});

const sns = new AWS.SNS();
const topic = 'arn:aws:sns:us-west-2:978126511751:pickups.fifo';

// const producer = Producer.create({
//   queueUrl: 'https://sqs.us-west-2.amazonaws.com/356127598444/deliveryConfirmation.fifo',
//   region: 'us-west-2'
// });



// AWS is opinionated about the case in the following payload:
const payload = {
  Message: '============= VENDOR ONE PICK UP NEEDED =================',
  TopicArn: topic,
  // id: chance.guid(),
  // body: stringifiedMessage,
  MessageGroupId: 'group1234',
  MessageDeduplicationId: chance.guid(), // typically a hash of the message body
};

// console.log(payload);

sns.publish(payload).promise()
  .then(data => console.log(data))
  .catch(err => console.log(err));



