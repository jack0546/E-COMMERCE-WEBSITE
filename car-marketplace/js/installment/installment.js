/* ============================================
   Installment Plan Module
   ============================================ */
const Installment = (() => {
  const INTEREST_RATE = 0.15; // 15% annual interest

  function calculate(carPrice, downPayment, months) {
    const principal = carPrice - downPayment;
    if (principal <= 0) return { monthly: 0, total: 0, interest: 0 };

    const monthlyRate = INTEREST_RATE / 12;
    const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const total = monthly * months;
    const interest = total - principal;

    return {
      monthly: Math.round(monthly * 100) / 100,
      total: Math.round(total * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      downPayment,
      months,
      carPrice
    };
  }

  async function requestPlan(userId, carId, downPayment, months) {
    const car = await CarDB.get('cars', carId);
    if (!car) throw new Error('Car not found');

    const calc = calculate(car.price, downPayment, months);

    const planId = await CarDB.add('installments', {
      userId,
      carId,
      carTitle: `${car.brand} ${car.model} ${car.year}`,
      carPrice: car.price,
      downPayment,
      months,
      monthlyPayment: calc.monthly,
      totalPayment: calc.total,
      interestAmount: calc.interest,
      status: 'pending',
      appliedAt: Date.now(),
      approvedAt: null,
      rejectedAt: null,
      adminNote: ''
    });

    return planId;
  }

  async function getUserPlans(userId) {
    return await CarDB.getByIndex('installments', 'userId', userId);
  }

  async function getAllPlans() {
    return await CarDB.getAll('installments');
  }

  async function approvePlan(planId, note) {
    const plan = await CarDB.get('installments', planId);
    if (!plan) throw new Error('Plan not found');
    plan.status = 'approved';
    plan.approvedAt = Date.now();
    plan.adminNote = note || 'Approved';
    await CarDB.put('installments', plan);
  }

  async function rejectPlan(planId, note) {
    const plan = await CarDB.get('installments', planId);
    if (!plan) throw new Error('Plan not found');
    plan.status = 'rejected';
    plan.rejectedAt = Date.now();
    plan.adminNote = note || 'Rejected';
    await CarDB.put('installments', plan);
  }

  return { calculate, requestPlan, getUserPlans, getAllPlans, approvePlan, rejectPlan, INTEREST_RATE };
})();

window.Installment = Installment;
