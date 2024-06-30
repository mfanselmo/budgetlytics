/**
 * @typedef {Object} TimedCategory
 * @property {string} name
 * @property {string} id
 * @property {string} currency
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
 * @param {Date} date current date
 * @param {number} periodStartDay the day (in number) the period starts for the user
 * @returns {Date} periodStart
 */
function getPeriodStart(date, periodStartDay) {
  let currentDate = new Date(date);
  let periodStart;

  if (currentDate.getDate() < periodStartDay) {
    periodStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      periodStartDay,
    );
  } else {
    periodStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      periodStartDay,
    );
  }

  periodStart.setHours(0, 0, 0, 0);
  return periodStart;
}

/**
 *
 * @param {Date} periodStart the date the period starts for the user
 * @returns {Date} periodEnd
 */
function getPeriodEnd(periodStart) {
  let periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  periodEnd.setDate(periodEnd.getDate() - 1);

  periodEnd.setHours(0, 0, 0, 0);
  return periodEnd;
}

/**
 *
 * @returns {number} periodStartDay
 */
async function getPeriodStartDay() {
  const dateRequest = new Request(
    "https://get-budgety.vercel.app/api/settings/getPeriodStartDay",
  );
  dateRequest.headers = HEADERS;

  const response = await dateRequest.loadJSON();
  console.log(response);

  return response["day"];
}

/**
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {TimedCategory[]} timedCategories
 */
async function getTimedCategoriesForPeriod(startDate, endDate) {
  const timedCategoriesRequest = new Request(
    `https://get-budgety.vercel.app/api/category/getAllInPeriod?startDate=${startDate.toISOString()}&endDate=${endDate}`,
  );
  timedCategoriesRequest.headers = HEADERS;

  const response = await timedCategoriesRequest.loadJSON();

  return response;
}

/**
 *
 * @param {Date} currentDate
 * @param {TimedCategory} timedCategory
 * @param {string} name
 * @param {number} amount
 * @returns {Transaction} transaction
 */
async function createTransactionInTimedCategory(
  currentDate,
  timedCategory,
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
    timedCategoryId: timedCategory.id,
    amount,
    currency: timedCategory.currency,
  });

  const response = await transactionRequest.loadJSON();

  return response;
}

/** -------- MAIN ---------------*/

const periodStartDay = await getPeriodStartDay();
console.log({ periodStartDay });

const currentDate = new Date();

const periodStart = getPeriodStart(currentDate, periodStartDay);
const periodEnd = getPeriodEnd(periodStart);

console.log({ periodStart });
console.log({ periodEnd });

const timedCategoriesForPeriod = await getTimedCategoriesForPeriod(
  periodStart,
  periodEnd,
);

console.log({ timedCategoriesForPeriod });

/** -------- */

const categoryAlert = new Alert();
categoryAlert.title = "Select category";

// Add actions
timedCategoriesForPeriod.forEach((timedCategory, index) => {
  categoryAlert.addAction(timedCategory.name);
});

categoryAlert.addCancelAction("Cancel");

// Present, and exit if user cancels
const categoryActionIndex = await categoryAlert.presentSheet();
if (categoryActionIndex === -1) {
  return;
}

const timedCategory = timedCategoriesForPeriod[categoryActionIndex];

console.log({ timedCategory });

/** -------- */

const transactionAlert = new Alert();
transactionAlert.title = "New transaction";
transactionAlert.message = `Enter a transaction for ${timedCategory.name}`;
const transactionNameField = transactionAlert.addTextField("Name");
const transactionAmountField = transactionAlert.addTextField("Amount");
transactionAmountField.setNumberPadKeyboard();

transactionAlert.addAction("Save");
transactionAlert.addCancelAction("Cancel");

const transactionActionIndex = await transactionAlert.present();

if (transactionActionIndex === -1) {
  return;
}

const transactionName = transactionAlert.textFieldValue(0);
const transactionAmount = parseInt(transactionAlert.textFieldValue(1));

console.log({ transactionName, transactionAmount });

const transaction = await createTransactionInTimedCategory(
  currentDate,
  timedCategory,
  transactionName,
  transactionAmount,
);

console.log({ transaction });
