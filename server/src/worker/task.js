export default async (task) => {
  const { id, time, userId, jobId } = task;
  console.log(
    `UserId: ${userId}, JobId:${jobId}, TaskId:${id} is executing...`
  );
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time * 1000);
  });
  console.log(`UserId: ${userId}, JobId:${jobId} TaskId:${id} is executed.`);
  return task;
};
