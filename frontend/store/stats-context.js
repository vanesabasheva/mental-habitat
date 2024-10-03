import { createContext, useState } from "react";

export const StatsContext = createContext({
  stats: {
    engines: 0,
    energy: 0,
    fuel: 0,
    grip: 0,
  },
  incrementStat: () => {},
  setAllStats: () => {},
});

function StatsContextProvider({ children }) {
  const [stats, setStats] = useState({
    engines: 0,
    energy: 0,
    fuel: 0,
    grip: 0,
  });

  const incrementStat = (updatedStat, increment) => {
    console.log("In increment stat..." + updatedStat + increment);
    console.log("Before" + JSON.stringify(stats));

    setStats((prevStats) => ({
      ...prevStats,
      [updatedStat]: prevStats[updatedStat] + increment,
    }));
    console.log("After" + JSON.stringify(stats));
  };

  const setAllStats = (newStats) => {
    setStats(newStats);
  };

  const value = {
    stats: stats,
    incrementStat: incrementStat,
    setAllStats: setAllStats,
  };

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
}

export default StatsContextProvider;
