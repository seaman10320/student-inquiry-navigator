import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyInquiry, resultToText } from './classifier.js'

test('장학 문의를 장학지원팀으로 분류한다', () => {
  const result = classifyInquiry('국가장학금 신청 결과가 언제 나오는지 알고 싶어요.')
  assert.equal(result.status, 'matched')
  assert.equal(result.id, 'scholarship')
  assert.match(resultToText(result), /장학지원팀/)
  assert.match(resultToText(result), /가상 신청 링크/)
})

test('휴학 문의를 학사지원팀으로 분류하고 P0 결과를 제공한다', () => {
  const result = classifyInquiry('휴학 신청을 하려면 어떤 서류가 필요한가요?')
  assert.equal(result.status, 'matched')
  assert.equal(result.id, 'leave')
  assert.equal(result.email, 'academic@example.edu')
  assert.ok(result.documents.includes('휴학신청서'))
  assert.ok(result.process.length > 0)
})

test('증명서 문의를 학사서비스팀으로 분류한다', () => {
  const result = classifyInquiry('졸업증명서를 발급받고 싶어요.')
  assert.equal(result.status, 'matched')
  assert.equal(result.id, 'certificate')
})

test('복학 문의에 복학 신청 정보를 제공한다', () => {
  const result = classifyInquiry('복학 신청 기간과 방법을 알고 싶어요.')
  assert.equal(result.status, 'matched')
  assert.equal(result.id, 'return')
  assert.ok(result.documents.includes('복학신청서'))
})

test('빈 입력을 구분한다', () => {
  assert.equal(classifyInquiry('   ').status, 'empty')
})

test('분류할 수 없는 문의는 대표번호 확인으로 안내한다', () => {
  const result = classifyInquiry('학교 근처 자취방을 추천해 주세요.')
  assert.equal(result.status, 'unmatched')
  assert.match(result.message, /02-000-0000/)
})
