/**
 * @typedef {Object} TimedCategory
 * @property {string} name
 * @property {string} id
 *
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} name
 * @property {number} amount
 * @property {string} currency
 * @property {Date} createdAt
 * @property {TimedCategory} timedCategory
 *
 * @typedef {Object} Color
 * @property {string} hex
 * @property {float} opacity
 *
 */

const API_TOKEN = "";

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_TOKEN}`,
};

/**
 *
 * @param {Date} currentDate
 * @param {string} timedCategoryId
 * @param {Currency} timedCategoryCurrency
 * @param {string} name
 * @param {number} amount
 * @returns {Transaction} transaction
 */
async function createTransactionInTimedCategory(
  currentDate,
  timedCategoryId,
  timedCategoryCurrency,
  name,
  amount,
) {
  const transactionRequest = new Request(
    `https://get-budgety.vercel.app/api/transaction/create`,
  );
  transactionRequest.headers = HEADERS;
  transactionRequest.method = "POST";
  transactionRequest.body = JSON.stringify({
    name,
    date: currentDate.toISOString(),
    timedCategoryId: timedCategoryId,
    amount,
    currency: timedCategoryCurrency,
  });

  const response = await transactionRequest.loadJSON();

  return response;
}

const currentDate = new Date();
const timedCategoryId = args.shortcutParameter["timedCategoryId"];
const timedCategoryCurrency = args.shortcutParameter["timedCategoryCurrency"];
const transactionName = args.shortcutParameter["transactionName"];
const transactionAmount = args.shortcutParameter["transactionAmount"];

const transaction = await createTransactionInTimedCategory(
  currentDate,
  timedCategoryId,
  timedCategoryCurrency,
  transactionName,
  transactionAmount,
);

Script.setShortcutOutput(transaction);
Script.complete();
