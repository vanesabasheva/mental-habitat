import { createContext, useEffect, useState } from "react";

export const AnswersContext = createContext({
  answers: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
  },
  addAnswer: () => {},
  removeAnswer: () => {},
  replaceAnswer: () => {},
  hasCompletedSurvey: Boolean,
  setHasCompletedSurvey: () => {},
});

function AnswersContextProvider({ children }) {
  const [answers, setAnswers] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
  });
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);

  const updateAnswers = (questionId, newAnswer) => {
    setAnswers((prevState) => ({
      ...prevState,
      [questionId]: [...prevState[questionId], newAnswer],
    }));
  };

  const removeAnswer = (questionId, option) => {
    setAnswers((prevState) => ({
      ...prevState,
      [questionId]: (prevState[questionId] || []).filter(
        (item) => item !== option
      ),
    }));
  };

  const replaceAnswer = (questionId, option) => {
    setAnswers((prevState) => ({
      ...prevState,
      [questionId]: [option],
    }));
  };

  const value = {
    answers: answers,
    addAnswer: updateAnswers,
    removeAnswer: removeAnswer,
    replaceAnswer: replaceAnswer,
    hasCompletedSurvey: hasCompletedSurvey,
    setHasCompletedSurvey: setHasCompletedSurvey,
  };
  return (
    <AnswersContext.Provider value={value}>{children}</AnswersContext.Provider>
  );
}

export default AnswersContextProvider;
