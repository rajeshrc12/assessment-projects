export function distributeTasks(tasks, cpuCount) {
  const lanes = Array.from({ length: cpuCount }, () => ({
    total: 0,
    list: [],
  }));

  const sorted = [...tasks].sort((a, b) => b.time - a.time);

  for (const task of sorted) {
    let lane = lanes.reduce((min, curr) =>
      curr.total < min.total ? curr : min
    );

    lane.list.push(task);
    lane.total += task.time;
  }

  return lanes.map((l) => l.list).filter((g) => g.length > 0);
}
