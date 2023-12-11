const { ToadScheduler, AsyncTask, CronJob } = require("toad-scheduler");
const { invokeContract } = require("./helpers");
const { updateTokensMetadataInDb, sendExchangesToDb } = require("./utils");

let id = 0;

const setExchangesLoop = async (
  contract,
  method,
  params,
  cronOptions,
  verbose = false,
  silent = true,
) => {
  const scheduler = new ToadScheduler();
  const task = new AsyncTask("getExchanges", () =>
    invokeContract(contract, method, params, verbose, silent).then(data => {
      console.log(data);
      sendExchangesToDb(data.exchanges);
      updateTokensMetadataInDb(data.exchanges, "Exchanges list every 1 hour");
    }),
  );
  const job = new CronJob(
    {
      cronExpression: cronOptions,
    },
    task,
    {
      preventOverrun: true,
      id: `id_${id}`,
    },
  );
  scheduler.addCronJob(job);
  scheduler.getById(`id_${id}`).start();
  id++;
};

module.exports = {
  setExchangesLoop,
};
