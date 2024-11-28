export const formatNumber = (num: number, decimals?: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(Math.round(num * Math.pow(10, decimals || 0)) / Math.pow(10, decimals || 0));
}; 