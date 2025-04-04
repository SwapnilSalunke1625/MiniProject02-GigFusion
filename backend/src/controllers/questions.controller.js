import { HfInference } from "@huggingface/inference";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Generate questions based on skill
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 */
const generateQuestions = asyncHandler(async (req, res) => {
  const { skill } = req.body;
  console.log(skill);

  if (!skill) {
    throw new ApiError(400, "Skill is required");
  }

  try {
    const response = await hf.textGeneration({
      model: "google/flan-t5-large",
      inputs: `Generate 10 technical multiple choice questions about ${skill}. Each question should have 4 options and one correct answer. Format each question as follows:
      Question: [Technical question about ${skill}]
      A) [Option 1]
      B) [Option 2]
      C) [Option 3]
      D) [Option 4]
      Correct Answer: [A/B/C/D]

      Make questions technical and specific to ${skill} field.`,
      parameters: {
        max_length: 2000,
        temperature: 0.8,
        top_p: 0.9,
        do_sample: true,
      },
    });

    // Parse the generated text into questions format
    const questions = parseGeneratedQuestions(response.generated_text);

    if (questions.length === 0) {
      throw new ApiError(500, "Failed to generate questions");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, questions, "Questions generated successfully")
      );
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new ApiError(500, "Failed to generate questions");
  }
});

/**
 * Parse generated text into questions format
 * @param {string} text
 * @returns {Array}
 */
const parseGeneratedQuestions = (text) => {
  try {
    // Split text into individual questions
    const questionBlocks = text
      .split(/Question:|Q:/)
      .filter((block) => block.trim());

    return questionBlocks.map((block) => {
      const lines = block
        .trim()
        .split("\n")
        .filter((line) => line.trim());

      // Extract question text
      const question = lines[0].trim();

      // Extract options
      const options = lines.slice(1, 5).map((line) => {
        const match = line.match(/[A-D]\)(.*)/);
        return match ? match[1].trim() : line.trim();
      });

      // Extract correct answer
      const correctLine = lines.find((line) =>
        line.toLowerCase().includes("correct answer")
      );
      const correctAnswer = correctLine
        ? "ABCD".indexOf(correctLine.match(/[A-D]/)[0])
        : 0;

      return {
        question,
        options,
        correctAnswer,
      };
    });
  } catch (error) {
    console.error("Error parsing questions:", error);
    return [];
  }
};

export { generateQuestions };
