# caps-cloud







1. Created sns topic, pickups.fifo
2. Go to IAM to set up permissions
 - AmazonSNSFullAccess
 - AmazonSQSFull Access

3. Create vendor-one.js
- npm init
- npm i aws-sdk
- npm i chance

4. Create driver.js
-npm i sqs-consumer

5. Create SQS FIFO queue: packages.fifo

6. Subscribe the SQS to the topic, pickups.fifo

<!-- - Create additional SNS and SQS as needed -->
<!-- ________________________________________ -->
1. Created sns topic, intransit
2. Create SQS queue: delivery-status-two
3. Subscribe the SQS to the topic, pickups.fifo -->
