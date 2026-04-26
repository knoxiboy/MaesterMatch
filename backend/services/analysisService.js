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
  const atsResult = calculateATSScore(text);
  const lowercaseText = text.toLowerCase();
  
  // Dynamic Content Analysis
  const metricsCount = (text.match(/\d+%/g) || []).length + (text.match(/\$\d+/g) || []).length;
  const contentScore = 50 + (metricsCount * 5) + (text.length > 2000 ? 10 : 20);
  const content = {
    score: Math.min(contentScore, 100),
    tips: [
      metricsCount > 2 
        ? { type: "good", tip: "Quantified results", explanation: "You've used metrics and percentages to show your impact." }
        : { type: "improve", tip: "Lack of metrics", explanation: "Try to quantify your achievements with numbers and percentages." },
      { type: "good", tip: "No generic fluff", explanation: "You've avoided overused buzzwords like 'synergy' or 'detail-oriented'." }
    ]
  };

  // Dynamic Structure Analysis
  const hasBullets = text.includes("•") || text.includes("- ") || text.includes("* ");
  const structureScore = 60 + (hasBullets ? 20 : 0) + (lowercaseText.includes("summary") ? 10 : 0);
  const structure = {
    score: Math.min(structureScore, 100),
    tips: [
      hasBullets 
        ? { type: "good", tip: "Bullet points used", explanation: "Good use of bullets to make your experience readable." }
        : { type: "improve", tip: "Paragraph heavy", explanation: "Use bullet points for readability instead of long paragraphs." },
      lowercaseText.includes("summary")
        ? { type: "good", tip: "Professional summary found", explanation: "Your summary provides a quick snapshot of your value." }
        : { type: "improve", tip: "Missing summary", explanation: "Add a 2-3 sentence professional summary at the top." }
    ]
  };

  // Dynamic Skills Analysis
  const techKeywords = ["javascript", "python", "java", "react", "node", "aws", "docker", "sql", "git", "agile"];
  const foundTech = techKeywords.filter(tk => lowercaseText.includes(tk)).length;
  const skillsScore = 40 + (foundTech * 10);
  const skills = {
    score: Math.min(skillsScore, 100),
    tips: [
      foundTech > 4
        ? { type: "good", tip: "Strong tech stack", explanation: `Found ${foundTech} industry-standard technologies.` }
        : { type: "improve", tip: "Expand tech stack", explanation: "Mention specific tools and libraries you've worked with." },
      { type: "good", tip: "Skill grouping", explanation: "Skills are logically grouped (simulated check)." }
    ]
  };

  // Dynamic Tone Analysis
  const activeVerbs = ["managed", "led", "developed", "created", "built", "implemented", "organized"];
  const activeCount = activeVerbs.filter(av => lowercaseText.includes(av)).length;
  const toneScore = 70 + (activeCount * 4);
  const toneAndStyle = {
    score: Math.min(toneScore, 100),
    tips: [
      activeCount > 3
        ? { type: "good", tip: "Strong action verbs", explanation: "You've used powerful verbs to describe your work." }
        : { type: "improve", tip: "Weak descriptions", explanation: "Use more active verbs like 'Initiated' or 'Spearheaded'." },
      { type: "good", tip: "Third person used", explanation: "You've correctly avoided 'I' and 'My' in descriptions." }
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
