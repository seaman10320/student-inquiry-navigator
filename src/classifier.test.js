import test from 'node:test'
import assert from 'node:assert/strict'
import {
  analyzeInquiry,
  buildGuidance,
  classifyInquiry,
  REPRESENTATIVE_PHONE,
  resultToText,
} from './classifier.js'
import { OFFICIAL_SOURCES } from './academicData.js'

const clarify = (query, answers = {}) => buildGuidance(analyzeInquiry(query), answers)

test('휴학 문의를 분석하고 확인 질문을 제공한다', () => {
  const result = analyzeInquiry('개인 사정으로 다음 학기를 쉬려고 합니다.')
  assert.equal(result.status, 'needs_clarification')
  assert.deepEqual(result.topicIds, ['leave'])
  assert.ok(result.questions.some((question) => question.id === 'leaveType'))
})

test('자퇴 문의에 공식 절차와 필요 서류를 제공한다', () => {
  const result = clarify('학교를 완전히 그만두려고 합니다.', {
    collegeGroup: 'college1',
    tuitionScholarship: 'tuition',
    international: 'no',
  })
  assert.equal(result.status, 'guided')
  assert.equal(result.topicIds[0], 'withdrawal')
  assert.ok(result.sections[0].documents.includes('보호자 연서가 포함된 자퇴원서'))
  assert.ok(result.sections[0].documents.includes('등록금 반환 대상이면 본인 명의 통장 사본'))
  assert.equal(result.contacts[0].phone, '031-280-3873')
})

test('복학 문의에서 군 복학 서류를 안내한다', () => {
  const result = clarify('전역해서 다음 학기에 다시 학교를 다니고 싶습니다.', {
    collegeGroup: 'college2',
    returnType: 'military',
  })
  assert.deepEqual(result.topicIds, ['return'])
  assert.match(result.sections[0].documents.join(' '), /전역증/)
})

test('자퇴 후 다시 다니려는 표현은 재입학으로 분석한다', () => {
  const result = analyzeInquiry('2년 전에 자퇴했는데 다시 학교를 다니고 싶습니다.')
  assert.deepEqual(result.topicIds, ['readmission'])
  assert.equal(result.prefilledAnswers.separationReason, 'withdrawal')
})

test('재입학 징계 사유는 최종 확인 경고를 표시한다', () => {
  const result = clarify('제적됐는데 다시 입학하고 싶어요.', {
    collegeGroup: 'college2',
    separationReason: 'disciplinary',
  })
  assert.match(result.sections[0].warnings.join(' '), /제한될 수/)
})

test('학과를 옮긴다는 일상 표현을 전과로 분석한다', () => {
  const result = analyzeInquiry('지금 전공이 맞지 않아서 다른 학과로 옮기고 싶어요.')
  assert.deepEqual(result.topicIds, ['transfer'])
})

test('전과 기본 조건을 충족하지 못하면 경고한다', () => {
  const result = clarify('다른 학과로 옮기고 싶어요.', {
    collegeGroup: 'college1',
    completedTerms: 'no',
    gradeRequirement: 'no',
  })
  const warnings = result.sections[0].warnings.join(' ')
  assert.match(warnings, /2개 학기/)
  assert.match(warnings, /2.5 미만/)
})

test('휴학과 복학이 함께 있는 복합 문의는 두 절차를 모두 유지한다', () => {
  const result = clarify('이번 학기에는 휴학하고 내년에 복학하려면 무엇을 해야 하나요?', {
    collegeGroup: 'freeMajor',
    leaveType: 'general',
    firstTerm: 'no',
    tuitionScholarship: 'none',
    returnType: 'general',
  })
  assert.equal(result.isComplex, true)
  assert.deepEqual(result.topicIds, ['leave', 'return'])
  assert.equal(result.sections.length, 2)
  assert.match(result.coordinationNotes.join(' '), /같은 시점/)
})

test('복학 후 전과 복합 문의에 선후관계를 안내한다', () => {
  const result = clarify('휴학 중인데 복학하면서 다른 학과로 전과하고 싶습니다.', {
    collegeGroup: 'college2',
    returnType: 'general',
    completedTerms: 'yes',
    gradeRequirement: 'yes',
  })
  assert.deepEqual(result.topicIds, ['return', 'transfer'])
  assert.match(result.coordinationNotes.join(' '), /복학 신청을 먼저/)
})

test('휴학·복학·전과 세 가지 복합 문의를 한 결과에 보존한다', () => {
  const result = clarify('한 학기 휴학한 뒤 복학하면서 학과를 바꾸고 싶어요.', {
    collegeGroup: 'college1',
    leaveType: 'general',
    firstTerm: 'no',
    tuitionScholarship: 'none',
    returnType: 'general',
    completedTerms: 'yes',
    gradeRequirement: 'yes',
  })
  assert.deepEqual(result.topicIds, ['leave', 'return', 'transfer'])
  assert.equal(result.sections.length, 3)
})

test('질병휴학에는 진단서 기준을 표시한다', () => {
  const result = clarify('치료 때문에 당분간 학교를 못 다닐 것 같아요.', {
    collegeGroup: 'college2',
    leaveType: 'illness',
    firstTerm: 'no',
    tuitionScholarship: 'none',
  })
  assert.match(result.sections[0].documents.join(' '), /4주 이상 진단서/)
})

test('소속 단과대학을 모르면 세 교학팀 후보를 보여준다', () => {
  const result = clarify('휴학 신청을 하고 싶어요.', {
    collegeGroup: 'unknown',
    leaveType: 'general',
    firstTerm: 'no',
    tuitionScholarship: 'none',
  })
  assert.equal(result.contacts.length, 3)
})

test('분류할 수 없는 문의는 공식 대표번호로 안내한다', () => {
  const result = analyzeInquiry('학교 근처 자취방을 추천해 주세요.')
  assert.equal(result.status, 'unmatched')
  assert.equal(result.representativePhone, REPRESENTATIVE_PHONE)
})

test('빈 입력과 결과 생성 오류 경로를 구분한다', () => {
  assert.equal(analyzeInquiry('   ').status, 'empty')
  assert.throws(() => analyzeInquiry('오류 테스트'), /result generation failed/)
})

test('공식 출처에는 example.com 가상 링크가 없다', () => {
  const result = clarify('재입학을 신청하고 싶어요.', {
    collegeGroup: 'college1',
    separationReason: 'withdrawal',
  })
  assert.ok(result.sources.every((source) => !source.url.includes('example.com')))
  assert.ok(result.sources.some((source) => source.url.includes('kangnam.ac.kr')))
})

test('학적변동 공식 안내는 항목별 고유 페이지에 연결된다', () => {
  const expectedMenuSequences = {
    leave: '95ab57ae199df28a4812e34d2267ae25',
    return: 'a2643e9dc95f1078bfec0078c09a6ac2',
    withdrawal: '68d833d94c47988fc5697afe26b3f24e',
    readmission: '57e44917a12b17cbdb4738db7cfaab86',
    transfer: '3a4030700fef59422915dadc03f67b33',
  }

  for (const [key, menuSequence] of Object.entries(expectedMenuSequences)) {
    assert.match(OFFICIAL_SOURCES[key].url, new RegExp(`encMenuSeq=${menuSequence}$`))
  }

  const routeUrls = Object.keys(expectedMenuSequences).map((key) => OFFICIAL_SOURCES[key].url)
  assert.equal(new Set(routeUrls).size, routeUrls.length)
})

test('호환 분류 함수와 텍스트 결과가 시연에 필요한 핵심 정보를 포함한다', () => {
  const result = classifyInquiry('휴학하고 싶어요.')
  const text = resultToText(result)
  assert.equal(result.status, 'guided')
  assert.match(text, /휴학 처리 경로/)
  assert.match(text, /담당 후보/)
  assert.match(text, /공식 근거 검증일/)
})
