import { createContext, useState } from "react";

export const StatsContext = createContext({
  stats: {
    engines: 0,
    energy: 0,
    grip: 0,
    fuel: 0,
  },
  categories: [],
  incrementStat: () => {},
  setAllStats: () => {},
  setAllCategories: () => {},
});

function StatsContextProvider({ children }) {
  const [stats, setStats] = useState({
    engines: 0,
    grip: 0,
    fuel: 0,
    energy: 0,
  });
  const [categories, setCategories] = useState([]);
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

  const setAllCategories = (allCategories) => {
    setCategories(allCategories);
  };

  const value = {
    stats: stats,
    categories: categories,
    incrementStat: incrementStat,
    setAllStats: setAllStats,
    setAllCategories: setAllCategories,
  };

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
}

export default StatsContextProvider;
