/**
 * Helper functions for ResultsDisplay component
 */

/**
 * Check if deductions object has any data
 */
export const hasDeductions = (deductions) => {
  if (!deductions) return false;
  return Object.values(deductions).some((val) => val != null && val !== '');
};

/**
 * Check if work_period object has any data
 */
export const hasWorkPeriod = (period) => {
  if (!period) return false;
  return (period.days != null && period.days !== '') ||
         (period.months != null && period.months !== '');
};

/**
 * Map refund direction to Hebrew label with emoji
 */
export const getRefundDirection = (direction) => {
  const directionMap = {
    refund: '✅ החזר כספי',
    pay_more: '⚠️ תשלום נוסף',
    none: '➖ אין הבדל',
  };
  return directionMap[direction] || direction;
};
