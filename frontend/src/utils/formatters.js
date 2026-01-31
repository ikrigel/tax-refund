/**
 * Formatting utilities for tax data display
 */

export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'לא זמין';
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value) => {
  if (value === null || value === undefined) return 'לא זמין';
  return new Intl.NumberFormat('he-IL').format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'לא זמין';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatMonthlyIncome = (monthly) => {
  if (!Array.isArray(monthly) || monthly.length === 0) {
    return 'לא זמין';
  }
  return `${monthly.length} חודשים`;
};

export const getTaxYearDisplay = (taxYear) => {
  return `שנת המס ${taxYear}`;
};

export const getSectionTitle = (sectionKey) => {
  const titles = {
    employee: 'פרטי העובד',
    employer: 'פרטי המעסיק',
    income: 'הכנסה',
    tax: 'מס',
    deductions: 'ניכויים',
    work_period: 'תקופת עבודה',
  };
  return titles[sectionKey] || sectionKey;
};
