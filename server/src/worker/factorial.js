export default async ({ id, time }) => {
  console.log(`[Worker ${id}] Timer started for ${time}ms`);

  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[Worker ${id}] Timer ended (${time}ms elapsed)`);
      resolve();
    }, time * 1000);
  });

  return { id, time };
};
