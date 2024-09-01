import React from 'react';

const Result = ({ questions, answers, onRestart }) => {
  const score = questions.reduce((acc, question, index) => {
    if (question.correct_answer === answers[index]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="main-result">
         <div className="result-container">
      <h1>Quiz Over</h1>
      <h2>Your Score: {score} / {questions.length}</h2>
      <button className="restart-button" onClick={onRestart}>Restart Quiz</button>
    </div>
    </div>
  );
};

export default Result;
