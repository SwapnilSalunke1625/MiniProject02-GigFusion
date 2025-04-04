import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaTrophy } from 'react-icons/fa';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cookies from 'js-cookie';

const Questions = ({ userSkill = "Plumbing" }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(10).fill(null));
 
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [showScore, setShowScore] = useState(false);

  // Function to generate questions using backend API
  const generateQuestions = async (skill) => {
    try {
        console.log(skill)
      const response = await axios.post(
        "http://localhost:8000/api/v1/questions/generate",
        { skill },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get('accessToken')}`
          }
        }
      );

      if (response.data.status === 'success') {
        setQuestions(response.data.data);
      } else {
        console.warn("Using fallback questions due to API response status:", response.data.status);
        setQuestions(sampleQuestions);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating questions:", error);
      if (error.code === "ERR_NETWORK") {
        alert("Could not connect to the server. Please make sure the backend is running. Using sample questions for now.");
      } else {
        alert("Failed to generate questions. Using sample questions instead.");
      }
      setQuestions(sampleQuestions);
      setIsLoading(false);
    }
  };

  // Sample questions as fallback
  const sampleQuestions = [
    {
      question: "What is your primary skill?",
      options: ["Plumbing", "Electrical", "Carpentry", "Painting"],
      correctAnswer: 0
    },
    {
      question: "How many years of experience do you have?",
      options: ["0-2 years", "2-5 years", "5-10 years", "10+ years"],
      correctAnswer: 0
    },
    {
      question: "What type of projects do you prefer?",
      options: ["Residential", "Commercial", "Industrial", "All of the above"],
      correctAnswer: 0
    },
    {
      question: "Do you have required certifications?",
      options: ["Yes", "No", "In Progress", "Not Required"],
      correctAnswer: 0
    },
    {
      question: "What is your preferred work schedule?",
      options: ["Full-time", "Part-time", "Weekends", "Flexible"],
      correctAnswer: 0
    },
    {
      question: "Do you have your own tools?",
      options: ["Yes, complete set", "Yes, basic set", "Some tools", "No"],
      correctAnswer: 0
    },
    {
      question: "What is your service area radius?",
      options: ["5-10 km", "10-20 km", "20-50 km", "50+ km"],
      correctAnswer: 0
    },
    {
      question: "Do you offer emergency services?",
      options: ["Yes, 24/7", "Yes, limited hours", "No", "Case by case"],
      correctAnswer: 0
    },
    {
      question: "What is your preferred payment method?",
      options: ["Cash", "Online Transfer", "Cards", "All methods"],
      correctAnswer: 0
    },
    {
      question: "Are you willing to travel for work?",
      options: ["Yes, anywhere", "Yes, within city", "No", "Depends on project"],
      correctAnswer: 0
    }
  ];

  useEffect(() => {
    generateQuestions(userSkill);
  }, [userSkill]);

  const calculateScore = () => {
    let correctCount = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    return (correctCount / questions.length) * 100;
  };

  const handleOptionSelect = (optionIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowScore(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stdBg to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stdBlue"></div>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Test Complete!</h2>
            <p className="text-xl text-gray-700 mb-2">Your Score:</p>
            <p className="text-4xl font-bold text-stdBlue mb-6">{score.toFixed(1)}%</p>
            <div className="space-y-4">
              <p className="text-gray-600">
                You answered {selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length} 
                out of {questions.length} questions correctly.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-stdBlue text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
              >
                Take Test Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Generate New Questions Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => {
                setIsLoading(true);
                generateQuestions(userSkill);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : null}
              Generate New Questions
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-stdBlue">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-stdBlue h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {questions[currentQuestion].question}
            </h2>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200
                    ${selectedAnswers[currentQuestion] === index
                      ? 'border-stdBlue bg-stdBlue/10 text-stdBlue'
                      : 'border-gray-200 hover:border-stdBlue/50'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 
                text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300"
            >
              <FaArrowLeft className="text-sm" />
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-stdBlue 
                  text-white hover:bg-blue-600 transition-all duration-300"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-stdBlue 
                  text-white hover:bg-blue-600 transition-all duration-300"
              >
                Next
                <FaArrowRight className="text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Questions.propTypes = {
  userSkill: PropTypes.string
};

export default Questions;
