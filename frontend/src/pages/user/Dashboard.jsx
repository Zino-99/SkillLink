import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardHome from "./sections/DashboardHome";
import ExploreSkills from "./sections/ExploreSkills";
import MyExchanges from "./sections/MyExchanges";
import MyMessages from "./sections/MyMessages";
import MyProfile from "./sections/MyProfile";

const Dashboard = () => {
  const [active, setActive] = useState("home");

  const renderContent = () => {
    switch (active) {
      case "home":      return <DashboardHome />;
      case "explore":   return <ExploreSkills />;
      case "exchanges": return <MyExchanges />;
      case "messages":  return <MyMessages />;
      case "profile":   return <MyProfile />;
      default:          return <DashboardHome />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;