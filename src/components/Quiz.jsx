import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Result from './Result';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(480); // 8 minutes in seconds

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
        setQuestions(response.data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0 && !showResult) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setShowResult(true);
    }
  }, [timer, showResult]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex + 1 < questions.length) {
        return prevIndex + 1;
      } else {
        setShowResult(true);
        return prevIndex;
      }
    });
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResult(false);
    setTimer(480);
  };

  if (showResult) {
    return <Result questions={questions} answers={answers} onRestart={handleRestart} />;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Quiz App</h1>
        <div className="timer">Time Left: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</div>
      </div>
      {questions.length > 0 && (
        <div className="quiz-question">
          <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <h3>{questions[currentQuestionIndex].question}</h3>
          {questions[currentQuestionIndex].incorrect_answers.concat(questions[currentQuestionIndex].correct_answer).sort().map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerChange(currentQuestionIndex, answer)}
              className={`answer-button ${answers[currentQuestionIndex] === answer ? 'selected' : ''}`}
            >
              {answer}
            </button>
          ))}
          <button className="next-button" onClick={handleNextQuestion}>
            {currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
