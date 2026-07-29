import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import CareerService from '../services/career/CareerService.js';

/**
 * @desc    Analyzes user profile, parses resume, queries Adzuna API, and calculates career intelligence report
 * @route   POST /api/career/analyze
 * @access  Public / Private
 */
export const analyzeCareer = asyncHandler(async (req, res, next) => {
  const { resumeText, manualSkills, role, location, experienceLevel, employmentType } = req.body;
  const file = req.file;

  const parsedSkills = Array.isArray(manualSkills) ? manualSkills : (typeof manualSkills === 'string' ? JSON.parse(manualSkills) : []);

  const result = await CareerService.analyzeCareerProfile({
    resumeText,
    file,
    manualSkills: parsedSkills,
    role: role || 'Backend Developer',
    location: location || 'Remote',
    experienceLevel: experienceLevel || 'Fresher',
    employmentType: employmentType || 'Full Time'
  });

  return res.status(200).json({
    success: true,
    message: 'Career Intelligence Report generated successfully.',
    data: result
  });
});

/**
 * @desc    Generates tailored AI Cover Letter
 * @route   POST /api/career/cover-letter
 * @access  Public / Private
 */
export const generateCoverLetter = asyncHandler(async (req, res) => {
  const { jobTitle, company, skills, experience } = req.body;

  const result = await CareerService.generateCoverLetter(jobTitle, company, { skills, experience });

  return res.status(200).json({
    success: true,
    data: result
  });
});
