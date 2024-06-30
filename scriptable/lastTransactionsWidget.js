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

const CurrencyToLocaleMap = {
  EUR: "en-EN",
  CLP: "es-CL",
};

/**
 *
 * @returns {Transaction[]} transactions
 */
async function getLastTransactions() {
  const transactionRequest = new Request(
    `https://get-budgety.vercel.app/api/transaction`,
  );
  transactionRequest.headers = HEADERS;
  const response = await transactionRequest.loadJSON();

  return response;
}

/**
 * @param {Widget} widget
 * @param {Transaction} transaction
 * @param {Color} color
 * @returns {string} row
 */
function createRow(widget, transaction, color) {
  let row = widget.addStack();

  const createdAt = new Date(transaction.createdAt);
  const dfTime = new DateFormatter();
  // dfTime.locale = "en";
  //   dfTime.useMediumDateStyle();
  dfTime.dateFormat = "MMM d";
  // dfTime.useNoTimeStyle();
  const dateString = dfTime.string(createdAt);

  const amountString = new Intl.NumberFormat(
    CurrencyToLocaleMap[transaction.currency],
    {
      style: "currency",
      currency: transaction.currency,
    },
  ).format(transaction.amount);

  const line1 = row.addText(
    `[${dateString}] ${transaction.name}: ${amountString}`,
  );
  line1.textColor = new Color(color.hex);
  line1.textOpacity = color.opacity;
  line1.font = new Font("Menlo", 11);

  row.addSpacer();
  const line2 = row.addText(`(${transaction.timedCategory.name})`);
  line2.textColor = new Color(color.hex);
  line2.textOpacity = color.opacity;
  line2.font = new Font("Menlo", 11);
}

const COLORS = [
  {
    hex: "#ffffff",
    opacity: 0.7,
  },
  {
    hex: "#ffffff",
    opacity: 1,
  },
  {
    hex: "#6ef2ae",
    opacity: 1,
  },
  {
    hex: "#ffcc66",
    opacity: 1,
  },
  {
    hex: "#7dbbae",
    opacity: 1,
  },
  {
    hex: "#ff9468",
    opacity: 1,
  },
  {
    hex: "#ffa7d3",
    opacity: 1,
  },
];

/**
 * @param {Transaction[]} transactions
 * @returns {Widget} w
 */
function createWidget(transactions) {
  const w = new ListWidget();
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color("#29323c"), new Color("#1c1c1c")];
  bgColor.locations = [0.0, 1.0];
  w.backgroundGradient = bgColor;
  w.setPadding(12, 15, 15, 12);
  w.spacing = 6;

  transactions.forEach((transaction, index) => {
    const color = COLORS[index % COLORS.length];
    createRow(w, transaction, color);
  });

  return w;
}

/** -- Main --- */

const transactions = await getLastTransactions();
const widget = createWidget(transactions);
Script.setWidget(widget);
Script.complete();
widget.presentMedium();
