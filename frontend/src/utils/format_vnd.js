// Định dạng VND (vi-VN): ví dụ 1.000.000 ₫
export function format_vnd(amount, options = {}) {
  const { fallback = "—" } = options;
  if (amount === null || amount === undefined || amount === "") {
    return fallback;
  }
  const n = Number(amount);
  if (Number.isNaN(n)) {
    return fallback;
  }
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(n);
}

// Chỉ số có dấu phân cách (không kèm ₫)
export function format_vnd_number(amount, options = {}) {
  const { fallback = "—" } = options;
  if (amount === null || amount === undefined || amount === "") {
    return fallback;
  }
  const n = Number(amount);
  if (Number.isNaN(n)) {
    return fallback;
  }
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(n);
}
