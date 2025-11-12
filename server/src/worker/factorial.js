export default async ({ id, number }) => {
  console.log(`[Worker ${id}] Timer started for ${number}ms`);

  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[Worker ${id}] Timer ended (${number}ms elapsed)`);
      resolve();
    }, number * 1000);
  });

  return { id, number };
};
