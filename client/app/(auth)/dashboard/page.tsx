import AddJob from "@/components/add-job";

const DashboardPage = () => {
  return (
    <div>
      <div className="flex justify-between p-2">
        <div className="font-bold text-xl">Jobs</div>
        <AddJob />
      </div>
    </div>
  );
};

export default DashboardPage;
