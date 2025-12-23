export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  const num = Number(value);
  if (isNaN(num)) {
    return 'N/A';
  }
  return num.toLocaleString('pt-BR');
};

export const formatDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleString('pt-BR');
  } catch (error) {
    return 'N/A';
  }
};
