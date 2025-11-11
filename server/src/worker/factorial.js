export const getFactorial = async (number) => {
  console.log(`Simulating work for ${number} seconds...`);

  // Convert number to seconds (optional)
  const delay = Number(number) * 1000;

  await new Promise((resolve) => setTimeout(resolve, delay));

  console.log(`Finished after ${number} seconds`);

  return `Processed in ${number} seconds`;
};
