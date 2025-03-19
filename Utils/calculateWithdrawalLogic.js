export const calcularBilletes = (target) => {
  if (target % 10000 !== 0 || target <= 0)
    return { error: "El monto debe ser un múltiplo de 10,000 y mayor a 0." };

  const denominations = [10000, 20000, 50000, 100000];
  let currentSum = 0;
  let billCount = [0, 0, 0, 0];


  while (currentSum < target) {
    let processed = false;
    for (let start = 0; start < denominations.length; start++) {
      let rowSum = 0;
      for (let pos = start; pos < denominations.length; pos++) {
        const add = (currentSum + rowSum + denominations[pos] <= target) ? denominations[pos]: 0; 
        rowSum += add;
        billCount[pos] += add ? 1 : 0;
      }
      currentSum += rowSum;
      processed = processed || rowSum;
    }
    if (!processed) break;
  }

  return { billCount, currentSum, denominations };
};
