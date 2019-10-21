const amqplib = require('amqplib');

const { MB_URL } = require('../config');

const queue = 'order-created';
let brokerConnection = null;

const initBroker = () => new Promise(async (resolve, reject) => {
  try {
    const connection = await amqplib.connect(url);
    resolve(connection);
  } catch (error) {
    console.warning(error);
    reject(error);
  }
});

const notifyOrderCreated = async (order) => {
  if (!brokerConnection) {
    brokerConnection = await initBroker(MB_URL);
  }

  await brokerConnection.createChannel()
    .then(ch => ch.assertQueue(queue)
      .then(() => {
        const orderObj = JSON.stringify(order);
        ch.sendToQueue(queue, Buffer.from(orderObj));
      })
    ).catch(console.warning);
}

module.exports = {
  notifyOrderCreated,
};
