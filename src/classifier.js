import {
  ACADEMIC_ROUTES,
  COLLEGE_GROUPS,
  OFFICIAL_SOURCES,
  QUESTION_LIBRARY,
  VERIFIED_AT,
} from './academicData.js'

export const REPRESENTATIVE_PHONE = '031-280-3114'

const routeMap = new Map(ACADEMIC_ROUTES.map((route) => [route.id, route]))
const unique = (items) => [...new Set(items)]

const OUT_OF_SCOPE_INTENTS = [
  {
    id: 'courseRegistration',
    label: '수강신청·재수강',
    terms: ['재수강', '수강신청', '수강 신청', '수강정정', '수강 정정', '수강취소', '수강 취소', '폐강'],
  },
  {
    id: 'attendance',
    label: '출결·공결',
    terms: ['결석', '출석', '공결', '병결', '지각', '조퇴'],
  },
  {
    id: 'gradesGraduation',
    label: '성적·학점·졸업',
    terms: [
      '졸업',
      '졸업학점',
      '졸업 학점',
      '성적 이의',
      '성적 정정',
      '학점 인정',
      '학점이 어떻게',
      '평점이 어떻게',
      '평균평점이 어떻게',
      '평균 평점이 어떻게',
    ],
  },
  {
    id: 'tuitionScholarship',
    label: '등록금·장학금·학자금대출',
    terms: [
      '학자금대출',
      '학자금 대출',
      '국가장학금',
      '국가 장학금',
      '교내장학금',
      '교내 장학금',
      '교외장학금',
      '교외 장학금',
      '등록금 환불',
      '등록금 반환',
      '등록금 이월',
      '등록금 처리',
      '등록금은 어떻게',
      '등록금이 어떻게',
      '등록금을 돌려',
      '장학금 유지',
      '장학금 취소',
      '장학금 반환',
      '장학금은 어떻게',
      '장학금이 어떻게',
      '장학금을 계속',
    ],
  },
  {
    id: 'itFacilities',
    label: 'IT·시설·생활 지원',
    terms: ['와이파이', 'wi-fi', 'wifi', '무선랜', '기숙사', '셔틀', '건물 위치', '강의실 위치'],
  },
]

const answerLabels = Object.values(QUESTION_LIBRARY).reduce((labels, question) => {
  labels[question.id] = new Map(question.options.map((option) => [option.value, option.label]))
  return labels
}, {})

const normalize = (value) => value
  .toLowerCase()
  .replace(/[.,!?()[\]{}'"“”‘’]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

function includesAny(query, terms) {
  return terms.some((term) => query.includes(normalize(term)))
}

function detectOutOfScopeIntents(query) {
  return OUT_OF_SCOPE_INTENTS
    .filter((intent) => includesAny(query, intent.terms))
    .map(({ id, label }) => ({ id, label }))
}

function detectCollegeGroup(query) {
  const college1 = ['복지융합', '경영관리', '예체능', '사회복지', '시니어비즈니스', '상경학부', '법행정세무', '디자인학과', '체육학과', '음악학과']
  const college2 = ['글로벌문화콘텐츠', '공과대학', '사범대학', '컴퓨터공학', '인공지능융합', '전자반도체', '부동산건설', '교육학과', '유아교육', '특수교육']
  const freeMajor = ['자유전공']

  if (includesAny(query, freeMajor)) return 'freeMajor'
  if (includesAny(query, college1)) return 'college1'
  if (includesAny(query, college2)) return 'college2'
  return ''
}

function detectPrefilledAnswers(query) {
  const answers = {}
  const collegeGroup = detectCollegeGroup(query)
  if (collegeGroup) answers.collegeGroup = collegeGroup

  if (includesAny(query, ['입대휴학', '군 휴학', '군대 때문에 쉬', '입대 때문에 학교', '군 복무 때문에 휴학'])) answers.leaveType = 'military'
  else if (includesAny(query, ['질병휴학', '아파서 휴학', '치료 때문에 쉬'])) answers.leaveType = 'illness'
  else if (includesAny(query, ['임신휴학', '출산휴학', '육아휴학'])) answers.leaveType = 'family'
  else if (includesAny(query, ['창업휴학'])) answers.leaveType = 'startup'
  else if (includesAny(query, ['일반휴학', '개인 사정으로 쉬'])) answers.leaveType = 'general'

  if (includesAny(query, [
    '군 복학',
    '전역',
    '제대',
    '군 복무를 마치',
    '군 복무 마치',
    '군 복무가 끝',
    '군대 다녀왔',
    '군대를 다녀왔',
  ])) answers.returnType = 'military'
  else if (includesAny(query, ['일반 복학'])) answers.returnType = 'general'

  if (includesAny(query, ['자퇴했', '자퇴 후'])) answers.separationReason = 'withdrawal'
  if (includesAny(query, ['미복학 제적', '미등록 제적'])) answers.separationReason = 'unregistered'
  if (includesAny(query, ['학사경고', '전과목 과락'])) answers.separationReason = 'academic'
  if (includesAny(query, ['징계 퇴학', '징계로 제적'])) answers.separationReason = 'disciplinary'

  const paidTuition = query.includes('등록금')
    && includesAny(query, ['등록금을 냈', '등록금은 이미 냈', '등록금 납부', '등록금을 납부', '등록금 낸 상태'])
  const receivedScholarship = query.includes('장학금')
    && includesAny(query, ['장학금도 받', '장학금을 받', '장학금 수혜', '장학금에 선발'])

  if (paidTuition && receivedScholarship) answers.tuitionScholarship = 'both'
  else if (paidTuition) answers.tuitionScholarship = 'tuition'
  else if (receivedScholarship) answers.tuitionScholarship = 'scholarship'

  if (includesAny(query, ['외국인 유학생', '외국인 학생'])) answers.international = 'yes'

  return answers
}

function isReadmissionContext(query) {
  return includesAny(query, ['재입학', '다시 입학', '자퇴했는데 다시', '제적됐는데 다시', '학교를 그만뒀다가 다시', '예전에 다니다가 다시'])
}

function detectRoutes(query) {
  const readmissionContext = isReadmissionContext(query)
  const currentLeaveStateOnly = query.includes('휴학 중')
    && !includesAny(query, ['휴학하려', '휴학하고', '휴학 신청', '휴학한 뒤', '쉬려고'])

  return ACADEMIC_ROUTES.filter((route) => {
    if (route.id === 'withdrawal' && readmissionContext && !includesAny(query, ['자퇴하려', '자퇴하고 싶', '그만두려고'])) {
      return false
    }
    if (route.id === 'return' && readmissionContext && !includesAny(query, ['복학', '휴학 끝', '군 복학'])) {
      return false
    }
    if (route.id === 'leave' && currentLeaveStateOnly) return false

    return includesAny(query, [...route.directTerms, ...route.semanticPatterns])
  })
}

function collectQuestions(routes, prefilledAnswers) {
  const seen = new Set()
  const questions = []

  routes.forEach((route) => {
    route.questionIds.forEach((questionId) => {
      if (seen.has(questionId) || prefilledAnswers[questionId]) return
      seen.add(questionId)
      questions.push(QUESTION_LIBRARY[questionId])
    })
  })

  return questions
}

export function analyzeInquiry(rawQuery) {
  const query = rawQuery.trim()

  if (!query) return { status: 'empty' }
  if (query.includes('오류 테스트')) throw new Error('Prototype result generation failed')

  const normalizedQuery = normalize(query)
  const matchedRoutes = detectRoutes(normalizedQuery)
  const unresolvedIntents = detectOutOfScopeIntents(normalizedQuery)

  if (matchedRoutes.length === 0) {
    return {
      status: 'unmatched',
      coverage: 'unsupported',
      query,
      unresolvedIntents,
      message: unresolvedIntents.length > 0
        ? `${unresolvedIntents.map((intent) => intent.label).join(' · ')} 문의는 현재 프로토타입에서 답을 생성하지 않습니다.`
        : '현재 시연 범위인 휴학·자퇴·복학·재입학·전과 문의를 찾지 못했습니다.',
      representativePhone: REPRESENTATIVE_PHONE,
      officialContactSource: OFFICIAL_SOURCES.contacts,
    }
  }

  const prefilledAnswers = detectPrefilledAnswers(normalizedQuery)
  const questions = collectQuestions(matchedRoutes, prefilledAnswers)
  const inferredContext = Object.entries(prefilledAnswers).map(([questionId, value]) => ({
    id: questionId,
    label: QUESTION_LIBRARY[questionId]?.label ?? questionId,
    value: answerLabel(questionId, value),
  }))

  return {
    status: 'needs_clarification',
    coverage: unresolvedIntents.length > 0 ? 'partial' : 'full',
    query,
    isComplex: matchedRoutes.length > 1,
    topicIds: matchedRoutes.map((route) => route.id),
    topics: matchedRoutes.map(({ id, label, overview }) => ({ id, label, overview })),
    unresolvedIntents,
    prefilledAnswers,
    inferredContext,
    questions,
    message: unresolvedIntents.length > 0
      ? `${matchedRoutes.map((route) => route.label).join(' · ')} 절차는 안내할 수 있지만, ${unresolvedIntents.map((intent) => intent.label).join(' · ')} 내용은 담당 부서 확인이 필요합니다.`
      : matchedRoutes.length > 1
        ? `${matchedRoutes.map((route) => route.label).join(' · ')} 절차가 함께 포함된 복합 문의입니다. 문장에서 확인되지 않은 조건만 추가로 묻습니다.`
        : `${matchedRoutes[0].label} 절차로 분석했습니다. 문장에서 확인되지 않은 조건만 추가로 묻습니다.`,
  }
}

function answerLabel(questionId, value) {
  return answerLabels[questionId]?.get(value) ?? value
}

function getDepartmentContacts(collegeGroup) {
  if (collegeGroup && collegeGroup !== 'unknown') {
    const department = COLLEGE_GROUPS.find((candidate) => candidate.id === collegeGroup)
    return department ? [department] : COLLEGE_GROUPS
  }
  return COLLEGE_GROUPS
}

function leaveDetails(answers) {
  const documents = []
  const warnings = []

  switch (answers.leaveType) {
    case 'general':
      documents.push('일반휴학은 별도 구비서류 없음')
      break
    case 'illness':
      documents.push('종합병원에서 발행한 4주 이상 진단서')
      warnings.push('정신건강 관련 질환은 6개월 이상 치료 사실을 확인할 수 있는 전문의 진단서 기준을 확인하세요.')
      break
    case 'military':
      documents.push('입영통지서·교육소집통지서 또는 군복무 확인 서류')
      break
    case 'family':
      documents.push('임신진단서 또는 출생·가족관계 증빙서류')
      break
    case 'startup':
      documents.push('창업휴학 심사에 필요한 서류 일체')
      warnings.push('창업휴학은 별도 신청 기간과 심사를 거쳐야 합니다.')
      break
    default:
      documents.push('휴학 유형을 먼저 확인해야 필요 서류를 확정할 수 있습니다.')
  }

  if (answers.firstTerm === 'yes') {
    warnings.push('신·편입·재입학 후 첫 학기에는 일반휴학이 제한됩니다. 예외 사유인지 교학팀에 확인하세요.')
  } else if (answers.firstTerm === 'unknown') {
    warnings.push('첫 학기 여부에 따라 일반휴학 가능 여부가 달라질 수 있습니다.')
  }

  if (['both', 'scholarship'].includes(answers.tuitionScholarship)) {
    warnings.push('장학금 수혜자는 등록 여부에 따라 장학금 유지·취소 처리가 달라질 수 있으므로 장학 담당 부서에 최종 확인하세요.')
  }
  if (['both', 'tuition'].includes(answers.tuitionScholarship)) {
    warnings.push('등록 후 휴학의 등록금 대체 여부와 예외 사유를 공식 안내에서 확인하세요.')
  }

  return { documents, warnings }
}

function withdrawalDetails(answers) {
  const documents = ['보호자 연서가 포함된 자퇴원서', '본인 신분증']
  const warnings = []

  if (['both', 'tuition'].includes(answers.tuitionScholarship)) {
    documents.push('등록금 반환 대상이면 본인 명의 통장 사본')
    warnings.push('등록금 반환액은 반환사유 발생일에 따라 달라지며, 휴학 중 자퇴는 최초 휴학 신청일이 기준이 될 수 있습니다.')
  }
  if (answers.international === 'yes') {
    documents.push('외국인 유학생 담당자 확인서')
    warnings.push('외국인 유학생은 학과 상담 전 대외교류센터 방문 상담이 추가됩니다.')
  } else if (answers.international === 'unknown') {
    warnings.push('외국인 유학생 여부에 따라 대외교류센터 사전 상담이 추가될 수 있습니다.')
  }

  return { documents, warnings }
}

function returnDetails(answers) {
  const documents = []
  const warnings = []

  if (answers.returnType === 'military') {
    documents.push('전역증 앞뒤면·병적증명서·병역사항 포함 주민등록초본 중 하나')
    warnings.push('전역일이 개강 후인 경우 실제 수업 참여 가능 시점과 추가 서류 기준을 확인하세요.')
  } else if (answers.returnType === 'general') {
    documents.push('일반 복학은 별도 첨부서류가 없는지 공식 안내에서 최종 확인')
  } else {
    documents.push('군 복학 여부를 확인해야 필요 서류를 확정할 수 있습니다.')
  }

  return { documents, warnings }
}

function readmissionDetails(answers) {
  const documents = ['재입학 모집 공고에서 요구하는 신청 정보']
  const warnings = []

  if (answers.separationReason === 'disciplinary') {
    warnings.push('징계 퇴학 사유는 재입학이 제한될 수 있으므로 교무팀의 최종 판단이 필요합니다.')
  } else if (answers.separationReason === 'academic') {
    documents.push('해당 시 전과목 과락학기 포기원')
  } else if (answers.separationReason === 'unknown') {
    warnings.push('이전 학적 종료 사유에 따라 재입학 가능 여부가 달라집니다.')
  }

  return { documents, warnings }
}

function transferDetails(answers) {
  const documents = ['종합정보시스템의 전체 성적표', '전입 희망 학부(과)의 별도 요구사항']
  const warnings = []

  if (answers.completedTerms === 'no') warnings.push('2개 학기 이상 이수하지 않았다면 기본 전과 신청 대상에 해당하지 않습니다.')
  if (answers.completedTerms === 'unknown') warnings.push('이수 학기 수를 확인해야 전과 신청 가능 여부를 판단할 수 있습니다.')
  if (answers.gradeRequirement === 'no') warnings.push('평균평점 2.5 미만이면 일반적인 성적 요건을 충족하지 못하며 예외 적용 여부를 확인해야 합니다.')
  if (answers.gradeRequirement === 'unknown') warnings.push('전체 평균평점을 확인해야 기본 자격을 판단할 수 있습니다.')

  return { documents, warnings }
}

function routeSpecificDetails(routeId, answers) {
  switch (routeId) {
    case 'leave': return leaveDetails(answers)
    case 'withdrawal': return withdrawalDetails(answers)
    case 'return': return returnDetails(answers)
    case 'readmission': return readmissionDetails(answers)
    case 'transfer': return transferDetails(answers)
    default: return { documents: [], warnings: [] }
  }
}

function coordinationNotes(topicIds) {
  const notes = []

  if (topicIds.includes('leave') && topicIds.includes('return')) {
    notes.push('휴학 신청과 복학 신청은 같은 시점에 처리하지 않습니다. 먼저 휴학 기간과 종료 예정 시점을 확인한 뒤 복학 신청 기간을 별도로 확인하세요.')
  }
  if (topicIds.includes('return') && topicIds.includes('transfer')) {
    notes.push('휴학 중 전과를 신청하려면 공식 안내에 따라 1차 복학 신청을 먼저 완료해야 할 수 있습니다.')
  }
  if (topicIds.includes('withdrawal') && topicIds.includes('readmission')) {
    notes.push('자퇴와 재입학은 즉시 이어지는 한 절차가 아닙니다. 자퇴 후 재입학 모집 일정·여석·심사를 별도로 거칩니다.')
  }
  if (topicIds.includes('leave') && topicIds.includes('withdrawal')) {
    notes.push('휴학 중 자퇴할 경우 등록금 반환 기준일이 휴학 신청일로 적용될 수 있으므로 자퇴 전에 반환 기준을 확인하세요.')
  }

  return notes
}

export function buildGuidance(analysis, selectedAnswers = {}) {
  if (analysis.status !== 'needs_clarification') {
    throw new Error('Guidance requires a clarified academic inquiry')
  }

  const answers = { ...analysis.prefilledAnswers, ...selectedAnswers }
  const routes = analysis.topicIds.map((id) => routeMap.get(id)).filter(Boolean)
  const contacts = getDepartmentContacts(answers.collegeGroup)

  const sections = routes.map((route) => {
    const details = routeSpecificDetails(route.id, answers)
    return {
      id: route.id,
      label: route.label,
      overview: route.overview,
      conditions: route.conditions,
      documents: unique(details.documents.length ? details.documents : route.baseDocuments),
      process: route.baseProcess,
      warnings: unique([...route.baseWarnings, ...details.warnings]),
      source: OFFICIAL_SOURCES[route.sourceKey],
    }
  })

  const context = Object.entries(answers)
    .filter(([, value]) => Boolean(value))
    .map(([questionId, value]) => ({
      id: questionId,
      label: QUESTION_LIBRARY[questionId]?.label ?? questionId,
      value: answerLabel(questionId, value),
    }))

  return {
    status: 'guided',
    coverage: analysis.coverage ?? 'full',
    query: analysis.query,
    isComplex: analysis.isComplex,
    topicIds: analysis.topicIds,
    unresolvedIntents: analysis.unresolvedIntents ?? [],
    title: analysis.isComplex
      ? `${routes.map((route) => route.label).join(' → ')} 통합 처리 경로`
      : `${routes[0].label} 처리 경로`,
    summary: analysis.coverage === 'partial'
      ? `${routes.map((route) => route.label).join(' · ')} 절차만 공식 안내 범위에서 정리했습니다. 함께 물어본 다른 내용은 아래의 추가 확인 항목을 확인하세요.`
      : analysis.isComplex
        ? '여러 학적변동이 연결된 문의입니다. 각 절차를 따로 신청하되 아래 선후관계와 확인 항목을 함께 보세요.'
        : `${routes[0].label} 관련 공식 안내를 학생의 다음 행동 순서로 정리했습니다.`,
    context,
    coordinationNotes: coordinationNotes(analysis.topicIds),
    sections,
    contacts,
    sources: [
      ...sections.map((section) => section.source),
      OFFICIAL_SOURCES.contacts,
      OFFICIAL_SOURCES.regulations,
    ].filter((source, index, sources) => sources.findIndex((candidate) => candidate.url === source.url) === index),
    verifiedAt: VERIFIED_AT,
    nextAction: analysis.coverage === 'partial'
      ? `아래 학적변동 절차를 먼저 확인하고, ${analysis.unresolvedIntents.map((intent) => intent.label).join(' · ')} 내용은 공식 안내 또는 담당 부서에 별도로 확인하세요.`
      : answers.collegeGroup && answers.collegeGroup !== 'unknown'
        ? '공식 안내 원문을 확인한 뒤, 필요한 경우 표시된 교학팀에 현재 상황과 확인한 내용을 함께 전달하세요.'
        : '소속 단과대학을 확인한 뒤 해당 교학팀 연락처와 공식 안내 원문을 다시 확인하세요.',
  }
}

// 이전 프로토타입과 테스트에서 사용하던 이름을 유지합니다.
export function classifyInquiry(rawQuery) {
  const analysis = analyzeInquiry(rawQuery)
  if (analysis.status !== 'needs_clarification') return analysis
  return buildGuidance(analysis, Object.fromEntries(analysis.questions.map((question) => [question.id, 'unknown'])))
}

export function resultToText(result) {
  if (result.status === 'unmatched') {
    return [
      '지원하지 않는 문의',
      result.message,
      '확인되지 않은 답을 생성하지 않았습니다.',
      `대표번호: ${result.representativePhone}`,
    ].join('\n')
  }
  if (result.status !== 'guided') return result.message ?? ''

  const lines = [
    result.title,
    `문의: ${result.query}`,
    ...(result.coverage === 'partial'
      ? [`추가 확인 필요: ${result.unresolvedIntents.map((intent) => intent.label).join(', ')}`]
      : []),
    ...result.sections.flatMap((section) => [
      `[${section.label}]`,
      `필요 서류: ${section.documents.join(', ')}`,
      `처리 절차: ${section.process.join(' → ')}`,
    ]),
    ...result.contacts.map((contact) => `담당 후보: ${contact.department} ${contact.phone}`),
    `공식 근거 검증일: ${result.verifiedAt}`,
    '※ 공식 안내를 요약한 시연용 결과이며 최종 판단은 담당 부서에 확인해야 합니다.',
  ]

  return lines.join('\n')
}
