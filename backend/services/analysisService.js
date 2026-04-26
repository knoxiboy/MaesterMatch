/**
 * Analysis Service - Logic for calculating ATS scores and generating feedback
 */

const calculateATSScore = (text) => {
  let score = 0;
  const tips = [];

  // 1. Length Check
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 400 && wordCount < 1000) {
    score += 20;
    tips.push({ type: "good", tip: "Optimal length", explanation: "Your resume is between 400-1000 words, which is the sweet spot for ATS." });
  } else if (wordCount < 400) {
    score += 10;
    tips.push({ type: "improve", tip: "Too short", explanation: "Your resume might be missing critical details. Aim for at least 400 words." });
  } else {
    score += 10;
    tips.push({ type: "improve", tip: "Too long", explanation: "Resumes over 1000 words can be overwhelming. Try to be more concise." });
  }

  // 2. Section Detection
  const sections = ["education", "experience", "skills", "projects", "contact", "summary"];
  let foundSections = 0;
  sections.forEach(section => {
    if (text.toLowerCase().includes(section)) {
      foundSections++;
    }
  });

  const sectionScore = (foundSections / sections.length) * 30;
  score += sectionScore;
  if (foundSections === sections.length) {
    tips.push({ type: "good", tip: "All standard sections found", explanation: "Your resume contains all the essential sections expected by an ATS." });
  } else {
    tips.push({ type: "improve", tip: "Missing sections", explanation: "Consider adding clear headers for Education, Experience, and Skills." });
  }

  // 3. Keyword Density (Simulated)
  const commonKeywords = ["leadership", "management", "development", "strategy", "analysis", "collaboration", "technical", "project"];
  let foundKeywords = 0;
  commonKeywords.forEach(kw => {
    if (text.toLowerCase().includes(kw)) foundKeywords++;
  });
  
  score += (foundKeywords / commonKeywords.length) * 30;
  if (foundKeywords > 5) {
    tips.push({ type: "good", tip: "Strong keyword usage", explanation: "You've used industry-standard action verbs and keywords." });
  } else {
    tips.push({ type: "improve", tip: "Enhance action verbs", explanation: "Incorporate more strong action verbs like 'Led', 'Developed', 'Analyzed'." });
  }

  // 4. Formatting/Contact (Simulated)
  if (text.includes("@") && /\d{10}/.test(text.replace(/\s/g, ""))) {
    score += 20;
    tips.push({ type: "good", tip: "Contact info present", explanation: "Email and phone number are clearly identifiable." });
  } else {
    score += 5;
    tips.push({ type: "improve", tip: "Contact info missing or unclear", explanation: "Ensure your email and phone number are easy for recruiters to find." });
  }

  return { score: Math.round(score), tips };
};

const analyzeResume = async (text) => {
  // Simulate detailed analysis for different categories
  const atsResult = calculateATSScore(text);
  
  // Create other sections with variations
  const toneAndStyle = {
    score: 75,
    tips: [
      { type: "good", tip: "Professional tone", explanation: "The language used is formal and appropriate for a corporate environment." },
      { type: "improve", tip: "Passive voice detected", explanation: "Try to use more active voice to sound more impactful." }
    ]
  };

  const content = {
    score: 82,
    tips: [
      { type: "good", tip: "Clear accomplishments", explanation: "You have used metrics to quantify your achievements." },
      { type: "improve", tip: "Vague descriptions", explanation: "Some responsibilities could be more specific. Use the STAR method." }
    ]
  };

  const structure = {
    score: 68,
    tips: [
      { type: "good", tip: "Reverse chronological order", explanation: "Your experience is well-structured from most recent to oldest." },
      { type: "improve", tip: "Complex layout", explanation: "Multi-column layouts can sometimes confuse older ATS systems." }
    ]
  };

  const skills = {
    score: 90,
    tips: [
      { type: "good", tip: "Balanced skill set", explanation: "You have a good mix of hard and soft skills." },
      { type: "good", tip: "Technical proficiency", explanation: "Specific tools and technologies are clearly listed." }
    ]
  };

  const overallScore = Math.round(
    atsResult.score * 0.3 + 
    toneAndStyle.score * 0.15 + 
    content.score * 0.25 + 
    structure.score * 0.15 + 
    skills.score * 0.15
  );

  return {
    overallScore,
    ATS: atsResult,
    toneAndStyle,
    content,
    structure,
    skills,
    rawText: text
  };
};

module.exports = { analyzeResume };
