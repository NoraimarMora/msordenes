const amqplib = require('amqplib');

const { BROKER_URL } = require('../config');

let brokerConnection = null;

const initBroker = () => new Promise(async (resolve, reject) => {
  try {
    const connection = await amqplib.connect(url);
    resolve(connection);
  } catch (error) {
    console.warn(error);
    reject(error);
  }
});

const notifyOrderCreated = async (queue, order) => {
  if (!brokerConnection) {
    brokerConnection = await initBroker(BROKER_URL);
  }

  await brokerConnection.createChannel()
    .then(ch => ch.assertQueue(queue)
      .then(() => {
        const orderObj = JSON.stringify(order);
        ch.sendToQueue(queue, Buffer.from(orderObj));
      })
    ).catch(console.warn);
}

module.exports = {
  notifyOrderCreated,
  initBroker
};
