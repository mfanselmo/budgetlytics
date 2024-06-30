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

return timedCategoriesForPeriod;
