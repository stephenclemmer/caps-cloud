# caps-cloud

### Feature Tasks & Requirements

1. SNS Topic: pickup which will receive all pickup requests from vendors

2. SQS Queue (FIFO): packages which will contain all delivery requests from vendors, in order of receipt.

- Subscribe this queue to the pickup topic so all pickups are ordered

3. SQS Queue (Standard) for each vendor (named for the vendor) which will contain all delivery notifications from the drivers

### Operations

**Vendors:**

- Vendors will post “pickup” messages containing delivery information into the SNS pickup topic
- { orderId: 1234, customer: "Jane Doe", vendorId: queueArn}
- Note the queueArn – this refers to the AWS ‘arn’ of the vendor’s specific delivered queue
- Pickup requests should be moved into a FIFO queue called packages for the drivers automatically
- (Make the packages queue a subscriber to the pickup topic)
- Vendors should separately subscribe to their personal SQS queue and periodically poll the queue to see delivery notifications

**Drivers:**

- Drivers will poll the SQS packages queue and retrieve only the next delivery order (message)
- After a time (e.g. 5 seconds), drivers will post a message to the Vendor specific SQS Queue using the queueArn specified in the order object

![Lab 19 UML](./assets/Lab%2019%20UML.png)

### Process for creating SNS/SQS

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


### Screenshots of each party

There is one Driver (driver.js) and two vendors, VendorOne and VendorTwo (vendor-one.js, vendor-two.js). At the time of this writing, only vendor two is wired up to listen to messages from the driver. The following screenshots are of one whole transaction as it is currently wired up.

Both of the vendors send off pickup requests. The pickup requests are help in a queue until the driver turns on their system. This is a screenshot of VendorOne's request. VendorTwo's request looked similar and will be visible on the third picture in this series:

![Pickup Request](./assets/vendor_one%20screenshot.png)

Once the Driver signs on, it immediately 'hears' both pickup requests that have been held in the queue. This is a screenshot of the driver's receipt of those requests:

![Driver receives pickup requests](./assets/driver.js%20Screenshot.png)

When the driver picks up the packages, it sends a message to the vendor, currently based on their company name, to alert that the packages are IN TRANSIT. This is a screenshot of VendorTwo's receipt of the Driver's message:

![VendorTwo receives message from driver that package is on transit](./assets/vendor_two%20screenshot.png)
