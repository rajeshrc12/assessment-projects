export default async (task) => {
  const { id, time } = task;
  console.log(`Task ${id} is executing...`);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time * 1000);
  });
  console.log(`Task ${id} is executed`);
  return task;
};
