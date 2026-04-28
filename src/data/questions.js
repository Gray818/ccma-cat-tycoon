const domains = [
  {
    domain: 'Foundational Knowledge',
    category: 'Anatomy, Terminology, and Conditions',
    scenario: 'A feline patient named Whiskers arrives for a wellness visit. The provider asks the MA to explain body systems and basic terminology to the owner.',
    question: 'Which response best uses accurate foundational medical knowledge?',
    choices: [
      'Explain that the cardiovascular system includes the heart and blood vessels that circulate oxygenated and deoxygenated blood.',
      'State that the endocrine system is responsible for only voluntary muscle movement.',
      'Tell the owner that all inflammation means bacterial infection and requires antibiotics.',
      'Describe nutrition as unrelated to chronic disease prevention.'
    ],
    correctAnswer: 0,
    explanation: 'The cardiovascular system includes the heart and vessels and is central to perfusion and oxygen delivery.',
    examTip: 'Tie terminology to function; CCMA items often test system-function links and patient teaching clarity.'
  },
  {
    domain: 'Patient Care and Clinical Workflow',
    category: 'Rooming and Communication',
    scenario: 'A nervous patient arrives late and appears embarrassed about discussing symptoms. The clinic is running behind.',
    question: 'What should the MA do first to support safe and respectful workflow?',
    choices: [
      'Greet the patient, verify identity, and obtain focused intake in a private and nonjudgmental manner.',
      'Skip identity verification to save time and room the next patient.',
      'Ask another patient in the waiting room to help interpret symptoms.',
      'Document guesses for missing history so the chart is complete.'
    ],
    correctAnswer: 0,
    explanation: 'Patient identification and respectful communication come before speed and protect safety and trust.',
    examTip: 'When two answers seem reasonable, choose the one that protects privacy, identification, and scope first.'
  },
  {
    domain: 'Vital Signs',
    category: 'Technique and Abnormal Findings',
    scenario: 'A patient sits for blood pressure after walking quickly from the parking lot and speaking on the phone.',
    question: 'Which action best improves blood pressure accuracy?',
    choices: [
      'Allow the patient to rest quietly, back supported, feet flat, arm at heart level, then repeat measurement.',
      'Measure immediately while the patient talks to capture a realistic daily value.',
      'Use the smallest cuff available to prevent overestimation errors.',
      'Place the cuff over thick clothing to reduce discomfort.'
    ],
    correctAnswer: 0,
    explanation: 'Proper positioning and rest reduce false elevations and align with best practice for accurate readings.',
    examTip: 'Technique errors are common test traps: cuff size, rest time, and arm position matter.'
  },
  {
    domain: 'Infection Control',
    category: 'Precautions and Sterility',
    scenario: 'During a busy shift, a patient with cough and fever is placed in an exam room while supplies are being restocked.',
    question: 'Which MA action best follows infection control principles?',
    choices: [
      'Perform hand hygiene before and after contact, use indicated PPE, and disinfect high-touch surfaces per protocol.',
      'Wear gloves only, because masks are optional whenever time is limited.',
      'Reuse a visibly clean disposable gown for the next patient.',
      'Skip room disinfection if the next patient has no respiratory symptoms.'
    ],
    correctAnswer: 0,
    explanation: 'Hand hygiene, appropriate PPE, and environmental disinfection are core infection prevention measures.',
    examTip: 'Know differences among cleaning, disinfection, and sterilization and when each is required.'
  },
  {
    domain: 'Phlebotomy',
    category: 'Collection and Handling',
    scenario: 'The MA prepares for venipuncture on a patient who reports feeling faint during prior blood draws.',
    question: 'What is the safest next step before collection?',
    choices: [
      'Verify two identifiers, position the patient safely, explain steps, and gather correct tubes before puncture.',
      'Proceed quickly without explanation to reduce anxiety duration.',
      'Draw from the arm with IV fluids running for convenience.',
      'Label specimens after leaving the room to avoid crowding the bedside.'
    ],
    correctAnswer: 0,
    explanation: 'Identification, safety positioning, preparation, and immediate bedside labeling reduce pre-analytical errors.',
    examTip: 'Phlebotomy questions often hinge on patient ID and specimen integrity steps.'
  },
  {
    domain: 'EKG',
    category: 'Lead Placement and Artifacts',
    scenario: 'A patient is prepped for a 12-lead EKG but the tracing shows heavy baseline wander and muscle artifact.',
    question: 'Which action should the MA take first?',
    choices: [
      'Reassess skin prep and electrode contact, ask the patient to remain still, and repeat tracing.',
      'Interpret the rhythm diagnosis independently and chart it as confirmed.',
      'Move limb leads to the torso without documenting changes.',
      'Ignore artifact because the provider can estimate rhythm regardless.'
    ],
    correctAnswer: 0,
    explanation: 'Improving prep and reducing movement commonly correct artifacts before repeating a 12-lead.',
    examTip: 'CCMA expects recognition of technical factors affecting EKG quality, not independent rhythm diagnosis.'
  },
  {
    domain: 'Medications',
    category: 'Safety and Administration',
    scenario: 'The provider orders an IM medication for a patient with a documented allergy in the chart.',
    question: 'What should the MA do before administration support?',
    choices: [
      'Verify the order, allergy status, and medication rights, then clarify with the provider if any discrepancy exists.',
      'Administer promptly because provider orders override allergy alerts.',
      'Ask a family member to confirm the allergy and proceed without chart review.',
      'Change the dose to a lower amount without notifying the provider.'
    ],
    correctAnswer: 0,
    explanation: 'Medication safety requires verification of rights and allergies with provider clarification for conflicts.',
    examTip: 'Prioritize patient safety checks over speed in medication workflow items.'
  },
  {
    domain: 'Laboratory and CLIA-waived Testing',
    category: 'Point-of-Care Testing and QC',
    scenario: 'Morning CLIA-waived testing begins, and the MA notices the control results are out of expected range.',
    question: 'Which action is most appropriate?',
    choices: [
      'Hold patient testing, troubleshoot per policy, repeat controls, and document corrective action.',
      'Run patient samples first and repeat controls later if results seem unusual.',
      'Discard control logs to avoid confusion and start a new worksheet.',
      'Report all out-of-range controls as patient critical values.'
    ],
    correctAnswer: 0,
    explanation: 'Out-of-range QC invalidates patient testing until corrected and documented per policy.',
    examTip: 'For CLIA-waived testing, QC and documentation are high-yield exam themes.'
  },
  {
    domain: 'Emergency Procedures',
    category: 'Acute Response',
    scenario: 'A patient in the lobby develops sudden facial droop and slurred speech while waiting for triage.',
    question: 'What should the MA do first?',
    choices: [
      'Activate emergency response per clinic protocol and alert the provider immediately.',
      'Offer water and reassess in fifteen minutes for symptom resolution.',
      'Ask the patient to complete registration paperwork before escalation.',
      'Drive the patient to the hospital in a personal vehicle.'
    ],
    correctAnswer: 0,
    explanation: 'Possible stroke symptoms require immediate activation of emergency procedures.',
    examTip: 'Time-sensitive emergencies (stroke, MI, anaphylaxis) demand immediate escalation.'
  },
  {
    domain: 'Administrative Assisting',
    category: 'Scheduling and Insurance',
    scenario: 'A patient calls requesting a same-day specialist referral and asks if insurance approval is guaranteed.',
    question: 'Which response is best?',
    choices: [
      'Explain referral steps, verify plan requirements, and document call details for provider review.',
      'Guarantee approval to reassure the patient and avoid complaints.',
      'Schedule with any specialist without checking network status.',
      'Tell the patient to contact billing because clinical staff cannot document calls.'
    ],
    correctAnswer: 0,
    explanation: 'Administrative accuracy requires clear expectations, verification, and documentation.',
    examTip: 'Know referral workflows, prior authorization basics, and appropriate call documentation.'
  },
  {
    domain: 'Law and Ethics',
    category: 'HIPAA and Consent',
    scenario: 'A relative asks for test results by phone but is not listed in the release-of-information section.',
    question: 'What is the correct MA response?',
    choices: [
      'Protect privacy, decline disclosure, and follow office policy for authorized release.',
      'Share limited details because family members usually know the patient history.',
      'Provide results if the caller states the patient date of birth correctly.',
      'Text the provider a screenshot of the chart and ask the caller to wait on hold.'
    ],
    correctAnswer: 0,
    explanation: 'HIPAA requires authorization before disclosure except as permitted by policy and law.',
    examTip: 'Privacy and consent items often test what not to disclose and how to document requests.'
  },
  {
    domain: 'OSHA and Safety',
    category: 'Bloodborne Pathogens and Hazards',
    scenario: 'After a blood draw, the MA is carrying a used needle toward the sharps container across the room.',
    question: 'Which action is safest and OSHA-aligned?',
    choices: [
      'Activate safety device and place the needle in an approved sharps container immediately without recapping.',
      'Recap the needle carefully before transport to avoid accidental sticks.',
      'Set the needle on a tray until all morning draws are complete.',
      'Place the needle in regular trash if no blood is visible.'
    ],
    correctAnswer: 0,
    explanation: 'Sharps must be disposed promptly in approved containers and should not be recapped.',
    examTip: 'OSHA items emphasize engineering controls, exposure plans, and immediate reporting steps.'
  },
  {
    domain: 'Professionalism',
    category: 'Teamwork and Boundaries',
    scenario: 'Two staff members argue loudly near patients about who should room the next appointment.',
    question: 'What professional action by the MA best supports patient-centered care?',
    choices: [
      'De-escalate respectfully, redirect conversation away from patients, and coordinate tasks through policy channels.',
      'Join the debate to defend one coworker and settle it in front of patients.',
      'Ignore the conflict and document that teamwork issues are not clinical.',
      'Post details in a staff group chat for informal voting.'
    ],
    correctAnswer: 0,
    explanation: 'Professional communication preserves patient trust and keeps operations safe and respectful.',
    examTip: 'Professionalism questions reward empathy, boundaries, and policy-based conflict resolution.'
  }
];

const difficulties = ['Easy', 'Medium', 'Hard', 'Boss'];

function transformQuestion(base, difficulty, idNum) {
  const bossPrefix =
    difficulty === 'Boss'
      ? 'Multi-step scenario: The clinic experiences simultaneous workflow pressure, safety concerns, and documentation demands. '
      : '';

  const scenarioTail =
    difficulty === 'Easy'
      ? 'The provider asks for the safest immediate MA action.'
      : difficulty === 'Medium'
      ? 'The MA must prioritize both patient safety and clinic workflow.'
      : difficulty === 'Hard'
      ? 'Multiple factors could create exam-level pitfalls if handled incorrectly.'
      : 'You must identify the best sequence of actions that remains within MA scope and policy.';

  const tipTail =
    difficulty === 'Boss'
      ? 'For boss items, think sequence: identify risk, protect patient, escalate, then document.'
      : difficulty === 'Hard'
      ? 'Hard items often include plausible distractors that skip one key safety step.'
      : difficulty === 'Medium'
      ? 'Medium items usually require balancing communication and technical accuracy.'
      : 'Easy items still test first-step safety principles.';

  return {
    id: `Q${idNum.toString().padStart(3, '0')}`,
    category: base.category,
    domain: base.domain,
    difficulty,
    scenario: `${bossPrefix}${base.scenario} ${scenarioTail}`,
    question:
      difficulty === 'Boss'
        ? `${base.question} Which full sequence is most appropriate first-to-last?`
        : base.question,
    choices: [...base.choices],
    correctAnswer: base.correctAnswer,
    explanation: `${base.explanation} Difficulty focus: ${difficulty}.`,
    examTip: `${base.examTip} ${tipTail}`
  };
}

export const questions = (() => {
  const pool = [];
  let idNum = 1;

  // 13 domains x 5 variants x 4 difficulties = 260 questions
  for (let variant = 0; variant < 5; variant += 1) {
    domains.forEach((base) => {
      difficulties.forEach((difficulty) => {
        pool.push(transformQuestion(base, difficulty, idNum));
        idNum += 1;
      });
    });
  }

  return pool;
})();

export function validateQuestions(questionList = questions) {
  const issues = [];
  const allowedDifficulty = new Set(['Easy', 'Medium', 'Hard', 'Boss']);

  questionList.forEach((q, index) => {
    const required = [
      'id',
      'category',
      'domain',
      'difficulty',
      'scenario',
      'question',
      'choices',
      'correctAnswer',
      'explanation',
      'examTip'
    ];

    required.forEach((field) => {
      if (q[field] === undefined || q[field] === null || q[field] === '') {
        issues.push(`Question at index ${index} missing ${field}`);
      }
    });

    if (!Array.isArray(q.choices) || q.choices.length !== 4) {
      issues.push(`Question ${q.id} must have exactly 4 choices`);
    }

    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) {
      issues.push(`Question ${q.id} has invalid correctAnswer index`);
    }

    if (!allowedDifficulty.has(q.difficulty)) {
      issues.push(`Question ${q.id} has invalid difficulty: ${q.difficulty}`);
    }
  });

  return {
    valid: issues.length === 0,
    count: questionList.length,
    issues
  };
}
