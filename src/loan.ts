type MortgageOptions = {
  amount: number;
  rate: number;
  years: number;
};

const calculateMortgage = (opts: MortgageOptions) => {
  const { amount, rate, years } = opts;

  // Сколько месяц выплачивать ипотеку
  const months = years * 12;

  // Базовый платеж по основному телу кредита
  const basePaymentForMonth = Math.round(amount / months);

  // Процентная ставка в месяц
  const ratePerMonth = rate / 12 / 100;

  // Сколько уже долга выплачено
  let debtPaid = 0;

  // Общая переплата по процентам
  let overpaid = 0;

  for (let i = 1; i < months + 1; i++) {
    // Оплата процентов
    const paymentForDebt = Math.round((amount - debtPaid) * ratePerMonth);

    // Считаем переплату
    overpaid += paymentForDebt;

    // Считаем сколько уже закрыли основного долга
    debtPaid += basePaymentForMonth;

    // Текущий платеж складывается из базового платежа + оплата процентов
    const payment = basePaymentForMonth + paymentForDebt;

    console.log(
      `(Платёж № ${i}) Платёж ${payment} руб - ${basePaymentForMonth} по основному долгу и ${paymentForDebt} по процентам. Уже оплачено ${debtPaid} / ${amount}. Всего переплата = ${overpaid}`,
    );
  }
};

const beautiful: MortgageOptions = {
  amount: 2400000,
  rate: 16,
  years: 2,
};

const real: MortgageOptions = {
  amount: 7500000,
  rate: 20,
  years: 10,
};

calculateMortgage(real);
