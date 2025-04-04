import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaTrophy } from "react-icons/fa";

const SkillValidation = ({ skill, userId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [showScore, setShowScore] = useState(false);

  // Static questions for different skills
  const questionsBySkill = {
    "Web Developer": [
      {
        id: "wd1",
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<href>", "<a>", "<url>"],
        correctAnswer: 2
      },
      {
        id: "wd2",
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        correctAnswer: 1
      },
      {
        id: "wd3",
        question: "Which JavaScript method is used to select an element by its id?",
        options: ["querySelector()", "getElement()", "getElementById()", "selectElement()"],
        correctAnswer: 2
      },
      {
        id: "wd4",
        question: "What is the correct way to include an external JavaScript file?",
        options: ["<script href='script.js'>", "<script name='script.js'>", "<script src='script.js'>", "<javascript src='script.js'>"],
        correctAnswer: 2
      },
      {
        id: "wd5",
        question: "Which CSS property changes the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctAnswer: 2
      },
      {
        id: "wd6",
        question: "What is the purpose of the localStorage object in JavaScript?",
        options: ["To store data on a server", "To store data on the client's browser", "To connect to a database", "To modify HTML elements"],
        correctAnswer: 1
      },
      {
        id: "wd7",
        question: "Which HTML5 element defines navigation links?",
        options: ["<navigation>", "<nav>", "<links>", "<menu>"],
        correctAnswer: 1
      },
      {
        id: "wd8",
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Automated Program Integration", "Application Program Installation", "Advanced Programming Interface"],
        correctAnswer: 0
      },
      {
        id: "wd9",
        question: "Which CSS property is used to create space between elements?",
        options: ["spacing", "margin", "padding", "gap"],
        correctAnswer: 1
      },
      {
        id: "wd10",
        question: "What is the purpose of React's useState hook?",
        options: ["To create global state", "To manage component state", "To handle HTTP requests", "To define components"],
        correctAnswer: 1
      }
    ],
    "Home Technician": [
      {
        id: "ht1",
        question: "Which tool would you use to detect a live electrical wire in a wall?",
        options: ["Multimeter", "Voltage tester", "Stud finder", "Level"],
        correctAnswer: 1
      },
      {
        id: "ht2",
        question: "What is the standard height for electrical outlets in residential homes?",
        options: ["12 inches from floor", "15 inches from floor", "18 inches from floor", "24 inches from floor"],
        correctAnswer: 1
      },
      {
        id: "ht3",
        question: "Which material should NOT be used to patch a drywall hole?",
        options: ["Joint compound", "Spackle", "Plaster", "Caulk"],
        correctAnswer: 3
      },
      {
        id: "ht4",
        question: "What is the recommended slope for a deck to ensure proper drainage?",
        options: ["1/4 inch per foot", "1/8 inch per foot", "1/2 inch per foot", "1 inch per foot"],
        correctAnswer: 0
      },
      {
        id: "ht5",
        question: "Which tool is best for measuring the squareness of a corner?",
        options: ["Tape measure", "Level", "Speed square", "Plumb bob"],
        correctAnswer: 2
      },
      {
        id: "ht6",
        question: "What is the most common reason for a toilet to run continuously?",
        options: ["Clogged drain", "Faulty flapper", "Cracked bowl", "Low water pressure"],
        correctAnswer: 1
      },
      {
        id: "ht7",
        question: "How should you dispose of dried latex paint?",
        options: ["Pour down drain", "Take to hazardous waste facility", "Regular trash after solidifying", "Burn it"],
        correctAnswer: 2
      },
      {
        id: "ht8",
        question: "What is the proper depth for fence post holes?",
        options: ["1/3 of post height", "1/4 of post height", "1/2 of post height", "2 feet regardless of post height"],
        correctAnswer: 0
      },
      {
        id: "ht9",
        question: "Which is NOT a common cause of poor airflow from HVAC vents?",
        options: ["Dirty filter", "Closed dampers", "Leaky ducts", "Thermostat setting"],
        correctAnswer: 3
      },
      {
        id: "ht10",
        question: "What is the best way to prevent mold in bathrooms?",
        options: ["Paint with mold-resistant paint", "Use bleach weekly", "Improve ventilation", "Keep lights on"],
        correctAnswer: 2
      }
    ],
    "Plumber": [
      {
        id: "p1",
        question: "Which tool is primarily used to clear clogged drains?",
        options: ["Pipe wrench", "Plunger", "Hacksaw", "Tape measure"],
        correctAnswer: 1
      },
      {
        id: "p2",
        question: "What is the standard diameter for a residential bathroom drain pipe?",
        options: ["1 inch", "1.25 inches", "1.5 inches", "2 inches"],
        correctAnswer: 2
      },
      {
        id: "p3",
        question: "Which type of pipe is most commonly used for water supply lines in modern homes?",
        options: ["Galvanized steel", "Cast iron", "PVC", "PEX"],
        correctAnswer: 3
      },
      {
        id: "p4",
        question: "What is the purpose of a P-trap in plumbing?",
        options: ["Increase water pressure", "Prevent sewer gases from entering the home", "Filter debris", "Reduce water usage"],
        correctAnswer: 1
      },
      {
        id: "p5",
        question: "Which fitting is used to connect two pipes of different materials?",
        options: ["Coupling", "Elbow", "Union", "Transition fitting"],
        correctAnswer: 3
      },
      {
        id: "p6",
        question: "What is the recommended slope for a horizontal drain pipe?",
        options: ["1/8 inch per foot", "1/4 inch per foot", "1/2 inch per foot", "1 inch per foot"],
        correctAnswer: 1
      },
      {
        id: "p7",
        question: "Which valve type is best for water supply shutoff?",
        options: ["Gate valve", "Globe valve", "Ball valve", "Check valve"],
        correctAnswer: 2
      },
      {
        id: "p8",
        question: "What material is commonly used for sealing pipe threads?",
        options: ["Electrical tape", "Duct tape", "Teflon tape", "Masking tape"],
        correctAnswer: 2
      },
      {
        id: "p9",
        question: "What is the main purpose of a water hammer arrestor?",
        options: ["Increase water pressure", "Reduce noise in pipes", "Filter sediment", "Prevent backflow"],
        correctAnswer: 1
      },
      {
        id: "p10",
        question: "Which tool is used to cut PVC pipe?",
        options: ["Pipe wrench", "Tubing cutter", "Hacksaw", "PVC pipe cutter"],
        correctAnswer: 3
      }
    ],
    "UI/UX": [
      {
        id: "ux1",
        question: "What does UI stand for?",
        options: ["User Interaction", "User Interface", "User Integration", "Universal Interface"],
        correctAnswer: 1
      },
      {
        id: "ux2",
        question: "Which of these is NOT a principle of good UX design?",
        options: ["Accessibility", "Consistency", "Complexity", "Feedback"],
        correctAnswer: 2
      },
      {
        id: "ux3",
        question: "What type of research involves observing users in their natural environment?",
        options: ["A/B Testing", "Surveys", "Ethnographic Research", "Focus Groups"],
        correctAnswer: 2
      },
      {
        id: "ux4",
        question: "What is a wireframe in UI/UX design?",
        options: ["A high-fidelity prototype", "A skeletal outline of a design", "A color palette", "A user journey map"],
        correctAnswer: 1
      },
      {
        id: "ux5",
        question: "Which design principle relates to grouping related items together?",
        options: ["Proximity", "Contrast", "Alignment", "Repetition"],
        correctAnswer: 0
      },
      {
        id: "ux6",
        question: "What is the purpose of a user persona?",
        options: ["To create fictional characters for marketing", "To represent demographic data", "To create a fictional user based on research", "To establish brand guidelines"],
        correctAnswer: 2
      },
      {
        id: "ux7",
        question: "What does the term 'affordance' refer to in UX design?",
        options: ["The cost of implementing a design", "How a design suggests its usage", "The accessibility of a design", "The time it takes to complete a task"],
        correctAnswer: 1
      },
      {
        id: "ux8",
        question: "What is a heatmap used for in UX research?",
        options: ["Testing loading speeds", "Visualizing user clicks and attention", "Measuring server performance", "Tracking color usage"],
        correctAnswer: 1
      },
      {
        id: "ux9",
        question: "Which of these is a key principle of accessible design?",
        options: ["Making all elements flashy", "Using only images for navigation", "Providing text alternatives for non-text content", "Using complex navigation paths"],
        correctAnswer: 2
      },
      {
        id: "ux10",
        question: "What is the primary goal of information architecture?",
        options: ["Creating beautiful interfaces", "Organizing content for easy use", "Increasing website traffic", "Reducing development costs"],
        correctAnswer: 1
      }
    ],
    "Video Editor": [
      {
        id: "ve1",
        question: "What does FPS stand for in video editing?",
        options: ["File Processing System", "Frames Per Second", "Final Production Setup", "Fast Preview Settings"],
        correctAnswer: 1
      },
      {
        id: "ve2",
        question: "Which file format is most commonly used for high-quality video export?",
        options: [".MP4", ".GIF", ".MOV", ".AVI"],
        correctAnswer: 0
      },
      {
        id: "ve3",
        question: "What is the J-cut technique in video editing?",
        options: ["A type of transition effect", "When audio from the next scene starts before the video", "A method of color correction", "A way to resize video frames"],
        correctAnswer: 1
      },
      {
        id: "ve4",
        question: "Which color space is typically used for video intended for web?",
        options: ["CMYK", "RGB", "HSB", "Grayscale"],
        correctAnswer: 1
      },
      {
        id: "ve5",
        question: "What does 'rendering' refer to in video editing?",
        options: ["Drawing storyboards", "Processing effects and transitions", "Capturing footage", "Adding audio tracks"],
        correctAnswer: 1
      },
      {
        id: "ve6",
        question: "Which of these is NOT a common video aspect ratio?",
        options: ["16:9", "4:3", "1:1", "3:2:1"],
        correctAnswer: 3
      },
      {
        id: "ve7",
        question: "What is a LUT in video editing?",
        options: ["Look-Up Table for color grading", "Low Usage Transition", "Linear Uniform Timing", "Layer Unification Technology"],
        correctAnswer: 0
      },
      {
        id: "ve8",
        question: "Which technique involves smoothing camera movement in post-production?",
        options: ["Keying", "Stabilization", "Masking", "Compositing"],
        correctAnswer: 1
      },
      {
        id: "ve9",
        question: "What does the 180-degree rule refer to?",
        options: ["A camera rotation technique", "A lighting setup", "A continuity guideline for camera placement", "A type of lens filter"],
        correctAnswer: 2
      },
      {
        id: "ve10",
        question: "Which audio format offers the highest quality for video production?",
        options: ["MP3", "WAV", "AAC", "MIDI"],
        correctAnswer: 1
      }
    ],
    "Android Developer": [
      {
        id: "ad1",
        question: "Which programming language is primarily used for Android app development?",
        options: ["Swift", "Kotlin", "C#", "Ruby"],
        correctAnswer: 1
      },
      {
        id: "ad2",
        question: "What file format is used for the Android app manifest?",
        options: [".gradle", ".java", ".xml", ".kt"],
        correctAnswer: 2
      },
      {
        id: "ad3",
        question: "Which component is NOT one of the four basic Android app components?",
        options: ["Activity", "Service", "Intent", "Content Provider"],
        correctAnswer: 2
      },
      {
        id: "ad4",
        question: "What is the purpose of the AndroidManifest.xml file?",
        options: ["To store user data", "To define the app structure and metadata", "To handle database operations", "To manage UI layouts"],
        correctAnswer: 1
      },
      {
        id: "ad5",
        question: "What is the Android build system called?",
        options: ["Maven", "Gradle", "Ant", "npm"],
        correctAnswer: 1
      },
      {
        id: "ad6",
        question: "Which XML file defines an app's user interface layout?",
        options: ["styles.xml", "layout.xml", "strings.xml", "colors.xml"],
        correctAnswer: 1
      },
      {
        id: "ad7",
        question: "What is an Intent in Android development?",
        options: ["A layout element", "A messaging object to request an action", "A database structure", "A UI animation"],
        correctAnswer: 1
      },
      {
        id: "ad8",
        question: "Which component is used to store structured data in an Android app?",
        options: ["SharedPreferences", "Activity", "SQLite Database", "Layout"],
        correctAnswer: 2
      },
      {
        id: "ad9",
        question: "What is the purpose of the Android Debug Bridge (ADB)?",
        options: ["To create UI designs", "To manage app permissions", "To communicate with an emulator or connected Android device", "To compile code"],
        correctAnswer: 2
      },
      {
        id: "ad10",
        question: "Which lifecycle method is called when an Activity is no longer visible?",
        options: ["onStop()", "onPause()", "onDestroy()", "onHide()"],
        correctAnswer: 0
      }
    ],
    "Script Writing": [
      {
        id: "sw1",
        question: "What does 'EXT.' stand for in a screenplay?",
        options: ["Extra", "Extension", "Exterior", "Exit"],
        correctAnswer: 2
      },
      {
        id: "sw2",
        question: "What is the standard format for writing character dialogue in a screenplay?",
        options: ["Italicized and centered", "All capitals and centered", "Character name centered above indented dialogue", "Right-aligned with quotation marks"],
        correctAnswer: 2
      },
      {
        id: "sw3",
        question: "What is a 'beat' in scriptwriting?",
        options: ["A musical cue", "A pause in dialogue", "A scene transition", "A camera direction"],
        correctAnswer: 1
      },
      {
        id: "sw4",
        question: "What is the three-act structure in storytelling?",
        options: ["Beginning, middle, denouement", "Setup, confrontation, resolution", "Introduction, body, conclusion", "Exposition, climax, finale"],
        correctAnswer: 1
      },
      {
        id: "sw5",
        question: "What is a logline?",
        options: ["The final line of a script", "A one or two-sentence summary of a script", "The main character's catchphrase", "A production note"],
        correctAnswer: 1
      },
      {
        id: "sw6",
        question: "What does 'V.O.' stand for in a screenplay?",
        options: ["Visual Order", "Verbal Output", "Voice Over", "Video Output"],
        correctAnswer: 2
      },
      {
        id: "sw7",
        question: "What is a slug line in a screenplay?",
        options: ["A description of the setting", "A camera direction", "A scene heading", "A transition between scenes"],
        correctAnswer: 2
      },
      {
        id: "sw8",
        question: "What does it mean when dialogue is marked '(O.S.)'?",
        options: ["On Screen", "Off Script", "Off Stage/Screen", "Original Speech"],
        correctAnswer: 2
      },
      {
        id: "sw9",
        question: "What is the purpose of a treatment in scriptwriting?",
        options: ["A summary of the script before writing it", "A legal document for copyright", "Notes from producers", "Dialogue rewrites"],
        correctAnswer: 0
      },
      {
        id: "sw10",
        question: "What is the standard page count for a feature film screenplay?",
        options: ["30-60 pages", "90-120 pages", "150-180 pages", "200+ pages"],
        correctAnswer: 1
      }
    ],
    "Technical": [
      {
        id: "t1",
        question: "What does CPU stand for?",
        options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"],
        correctAnswer: 0
      },
      {
        id: "t2",
        question: "Which protocol is used for secure internet browsing?",
        options: ["HTTP", "HTTPS", "FTP", "SMTP"],
        correctAnswer: 1
      },
      {
        id: "t3",
        question: "What is the function of RAM in a computer?",
        options: ["Long-term storage", "Temporary data storage during use", "Processing calculations", "Managing network connections"],
        correctAnswer: 1
      },
      {
        id: "t4",
        question: "Which of these is NOT an operating system?",
        options: ["Windows", "macOS", "Linux", "Oracle"],
        correctAnswer: 3
      },
      {
        id: "t5",
        question: "What does IoT stand for?",
        options: ["Internet of Technology", "Internet of Things", "Integration of Technology", "Input Output Transfer"],
        correctAnswer: 1
      },
      {
        id: "t6",
        question: "Which of these is a relational database management system?",
        options: ["MongoDB", "Redis", "MySQL", "Elasticsearch"],
        correctAnswer: 2
      },
      {
        id: "t7",
        question: "What is cloud computing?",
        options: ["Weather forecasting technology", "Delivery of computing services over the internet", "A type of encryption", "Local network storage"],
        correctAnswer: 1
      },
      {
        id: "t8",
        question: "What does API stand for in programming?",
        options: ["Application Programming Interface", "Automated Program Instruction", "Application Process Integration", "Advanced Programming Input"],
        correctAnswer: 0
      },
      {
        id: "t9",
        question: "Which of these is a version control system?",
        options: ["Docker", "Jenkins", "Git", "Kubernetes"],
        correctAnswer: 2
      },
      {
        id: "t10",
        question: "What is the purpose of a firewall?",
        options: ["Increase internet speed", "Monitor system temperature", "Block unauthorized access", "Enhance display resolution"],
        correctAnswer: 2
      }
    ]
  };

  // Default questions for skills not in our database
  const defaultQuestions = [
    {
      id: "d1",
      question: "What is your level of experience in this field?",
      options: ["Beginner", "Intermediate", "Advanced", "Expert"],
      correctAnswer: 2
    },
    {
      id: "d2",
      question: "How many years have you been working in this industry?",
      options: ["Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"],
      correctAnswer: 3
    },
    {
      id: "d3",
      question: "Have you completed formal training or certification?",
      options: ["No formal training", "Some courses", "Certified", "Advanced certification"],
      correctAnswer: 2
    },
    {
      id: "d4",
      question: "How comfortable are you teaching others in this field?",
      options: ["Not comfortable", "Somewhat comfortable", "Comfortable", "Very comfortable"],
      correctAnswer: 3
    },
    {
      id: "d5",
      question: "How do you stay updated with the latest developments in your field?",
      options: ["I don't regularly update my knowledge", "Online articles", "Professional training", "Industry conferences and continuous learning"],
      correctAnswer: 3
    },
    {
      id: "d6",
      question: "What is your preferred work environment?",
      options: ["Indoors only", "Outdoors only", "Both indoors and outdoors", "Remote work"],
      correctAnswer: 2
    },
    {
      id: "d7",
      question: "How would you rate your problem-solving skills?",
      options: ["Basic", "Intermediate", "Advanced", "Expert"],
      correctAnswer: 2
    },
    {
      id: "d8",
      question: "Do you have experience with digital tools in your field?",
      options: ["No experience", "Limited experience", "Moderate experience", "Extensive experience"],
      correctAnswer: 2
    },
    {
      id: "d9",
      question: "How do you handle work under tight deadlines?",
      options: ["I struggle with tight deadlines", "I can manage but prefer not to", "I work well under pressure", "I excel under tight deadlines"],
      correctAnswer: 3
    },
    {
      id: "d10",
      question: "What is your approach to customer service?",
      options: ["Focus on completing the job", "Balance efficiency with customer satisfaction", "Focus primarily on customer satisfaction", "Exceed customer expectations at all costs"],
      correctAnswer: 2
    }
  ];

  // Load questions based on skill
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay for a more realistic experience
    setTimeout(() => {
      const skillQuestions = questionsBySkill[skill] || defaultQuestions;
      setQuestions(skillQuestions);
      setSelectedAnswers({});
      setIsLoading(false);
    }, 800);
  }, [skill]);

  const calculateScore = () => {
    let correctCount = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return (correctCount / questions.length) * 100;
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
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
    
    // Here you can handle the userId and score submission logic
    // console.log(User ID: ${userId}, Score: ${finalScore});
    // You can send this data to your backend or store it as needed
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowScore(false);
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{skill} Validation Complete!</h2>
            <p className="text-xl text-gray-700 mb-2">Your Score:</p>
            <p className="text-4xl font-bold text-stdBlue mb-6">{score.toFixed(1)}%</p>
            <div className="space-y-4">
              <p className="text-gray-600">
                You answered {Object.keys(selectedAnswers).length} out of {questions.length} questions.
              </p>
              <p className="text-gray-600 mb-6">
                {score >= 70 
                  ? "Congratulations! You've demonstrated good knowledge in this skill." 
                  : "Keep learning! You can improve your score with more practice."}
              </p>
              <button
                onClick={handleTryAgain}
                className="px-8 py-3 bg-stdBlue text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header with skill name */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stdBlue">{skill} Skill Validation</h1>
            <p className="text-gray-600">Answer the following questions to validate your knowledge</p>
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
          {currentQ && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {currentQ.question}
              </h2>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(currentQ.id, index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200
                      ${selectedAnswers[currentQ.id] === index
                        ? 'border-stdBlue bg-stdBlue/10 text-stdBlue'
                        : 'border-gray-200 hover:border-stdBlue/50'
                      }`}
                  >
                  {option}
                  </button>
              ))}
            </div>
        </div>
      )}

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

export default SkillValidation;