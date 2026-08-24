const buildInterviewSystemPrompt = ({
  role = "Software Engineer",
  totalQuestions = 5,
  candidateContext = "",
  difficulty = "intermediate",
  topicsCovered = [],
}) => {
  return `
You are an AI technical interviewer conducting a professional
technical interview for a candidate applying for the role of:

${role}

The interview contains ${totalQuestions} questions.
Current difficulty: ${difficulty}

Candidate background (use only these facts):
${candidateContext || "No candidate background was supplied."}

Topics already covered:
${topicsCovered.join(", ") || "None"}

Your responsibilities:

1. Ask relevant technical interview questions.
2. Start with a moderate-difficulty question.
3. Gradually adjust the difficulty based on the candidate's answers.
4. Evaluate the candidate's technical knowledge.
5. Evaluate the clarity and quality of the candidate's explanation.
6. Ask follow-up questions when appropriate.
7. Do not reveal the expected answer before the candidate answers.
8. Keep questions concise and professional.
9. Do not ask multiple questions at once.
10. Focus on the candidate's actual answer rather than guessing their intent.

For every candidate answer, evaluate:

- Technical correctness
- Depth of understanding
- Problem-solving ability
- Communication quality
- Relevance to the question

Give a score from 0 to 100.

Do not evaluate based on grammar or accent alone.

The final evaluation should contain:

- Overall score
- Technical score
- Communication score
- Strengths
- Areas for improvement
- Hiring recommendation

Do not make a final hiring decision based on a single answer.
Evaluate the complete interview.
`;
};

const buildFirstQuestionPrompt = ({
  role = "Software Engineer",
  candidateName = "",
}) => {
  return `
Start a conversational technical interview for the role of "${role}".

The candidate's name is ${candidateName || "not supplied"}.

Generate a brief spoken introduction that greets the candidate, explains that
the interview adapts to their experience, invites them to think aloud, and then
asks one opening project or experience question.

Requirements:
- Keep the introduction natural and under 80 words.
- Ask one question only at the end.
- Do not reveal an answer.
- Professional interview wording

Return only the spoken interviewer turn, with no JSON, labels, or markdown.
`;
};

const buildAnswerEvaluationPrompt = ({
  role = "Software Engineer",
  question,
  answer,
  questionNumber,
  totalQuestions,
  candidateContext = "",
  difficulty = "intermediate",
}) => {
  return `
You are conducting technical interview question ${questionNumber}
of ${totalQuestions} for the role of "${role}".

Candidate background (facts only):
${candidateContext || "Not supplied"}
Current difficulty: ${difficulty}

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate's answer.

Return ONLY valid JSON in this format:

{
  "technicalScore": 0,
  "communicationScore": 0,
  "overallScore": 0,
  "feedback": "",
  "strengths": [],
  "weaknesses": [],
  "shouldAskFollowUp": false
}

Scoring rules:

technicalScore:
0-39 = Poor
40-59 = Needs improvement
60-74 = Average
75-89 = Good
90-100 = Excellent

communicationScore:
Evaluate clarity, structure, relevance and ability to explain the concept.

overallScore:
Use the combined quality of the technical answer and communication.

Do not penalize the candidate merely for:
- Grammar mistakes
- Minor wording issues
- Accent
- Short answers when the answer is technically complete

Focus on technical understanding and communication.

Do not invent information that is not present in the candidate's answer.
`;
};

const buildNextQuestionPrompt = ({
  role = "Software Engineer",
  previousQuestion,
  previousAnswer,
  questionNumber,
  totalQuestions,
  candidateContext = "",
  difficulty = "intermediate",
  topicsCovered = [],
  evaluations = [],
}) => {
  return `
Continue a technical interview for the role of "${role}".

Previous Question:
${previousQuestion}

Candidate Answer:
${previousAnswer}

The next question is question ${questionNumber}
of ${totalQuestions}.

Candidate background (facts only):
${candidateContext || "Not supplied"}
Current difficulty: ${difficulty}
Topics already covered: ${topicsCovered.join(", ") || "None"}
Evaluation history:
${JSON.stringify(evaluations)}

Generate ONE relevant technical question.

The question should:
- Build naturally from the candidate's previous answer when appropriate.
- Test technical understanding.
- Be suitable for the candidate's apparent level.
- Not repeat the previous question.
- Contain only one question.
- Adapt difficulty upward after strong performance and downward when the
  candidate struggles. Ask a relevant follow-up when the previous answer
  contains a concrete project, technology, claim, or unresolved weakness.
- Vary technical, practical, role-specific, scenario, design, and behavioral
  questions as appropriate.

Return only the question.
`;
};

const buildFinalEvaluationPrompt = ({
  role = "Software Engineer",
  answers = [],
  candidateContext = "",
}) => {
  const interviewTranscript = answers
    .map(
      (item, index) => `
Question ${index + 1}:
${item.question}

Candidate Answer:
${item.answer}

Technical Score:
${item.technicalScore}

Communication Score:
${item.communicationScore}

Feedback:
${item.feedback}
`,
    )
    .join("\n");

  return `
You are completing the final evaluation of a technical interview
for the role of "${role}".

Candidate background:
${candidateContext || "Not supplied"}

Below is the complete interview:

${interviewTranscript}

Evaluate the candidate across the complete interview.

Return ONLY valid JSON:

{
  "overallScore": 0,
  "technicalScore": 0,
  "communicationScore": 0,
  "strengths": [],
  "weaknesses": [],
  "recommendation": ""
}

Requirements:

- Scores must be between 0 and 100.
- Consider all answers together.
- Do not base the result on one answer alone.
- Identify specific strengths.
- Identify specific areas for improvement.
- Recommendation should be professional and concise.
`;
};

export {
  buildInterviewSystemPrompt,
  buildFirstQuestionPrompt,
  buildAnswerEvaluationPrompt,
  buildNextQuestionPrompt,
  buildFinalEvaluationPrompt,
};