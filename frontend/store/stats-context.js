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
  currentLevel: 1,
  setCurrentLevel: () => {},
});

function StatsContextProvider({ children }) {
  const [stats, setStats] = useState({
    engines: 0,
    grip: 0,
    fuel: 0,
    energy: 0,
  });
  const [categories, setCategories] = useState([]);
  const [level, setLevel] = useState(1);
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

  const setCurrentLevel = (currentLevel) => {
    setLevel(currentLevel);
  };

  const value = {
    stats: stats,
    categories: categories,
    currentLevel: level,
    incrementStat: incrementStat,
    setAllStats: setAllStats,
    setAllCategories: setAllCategories,
    setCurrentLevel: setCurrentLevel,
  };

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
}

export default StatsContextProvider;
