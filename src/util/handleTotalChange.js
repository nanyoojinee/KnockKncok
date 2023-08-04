export const handleTotalChange = (setValueFunction) => (e) => {
  const value = parseInt(e.target.value, 10);
  if (!isNaN(value) && value !== 0) {
    setValueFunction(value);
  }
};