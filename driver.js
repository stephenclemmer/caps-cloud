const AWS = require('aws-sdk');
const Chance = require('chance');
const chance = new Chance();


AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS();
const topic = 'arn:aws:sns:us-west-2:978126511751:intransit';

// __________________________________


const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/978126511751/packages.fifo',
  handleMessage: async (data) => {
    // do some work with `message`
    console.log(data);
    // _____________________________________________

    // SEND IN TRANSIT MESSAGE

    if (data.Body.includes('VENDOR TWO')) {
      const payload = {
        Message: '============= INTRANSIT =================',
        TopicArn: topic,
      };

      sns.publish(payload).promise()
        .then(data => console.log(data))
        .catch(err => console.log(err));

      // console.log(payload);
    }
  },
});


app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();
