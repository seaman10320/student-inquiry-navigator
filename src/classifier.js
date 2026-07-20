export const ROUTES = [
  {
    id: 'leave',
    category: '학적·휴학',
    keywords: ['휴학', '군휴학', '일반휴학'],
    department: '가상 학사지원팀',
    phone: '02-000-1001',
    email: 'academic@example.edu',
    hours: '평일 09:00–17:00',
    location: '가상 행정관 1층',
    reason: '휴학 신청과 학적 변경에 관한 문의로 분류했습니다.',
    documents: ['휴학신청서', '가상 확인 서류'],
    applicationUrl: 'https://example.edu/leave',
    process: ['신청 기간 확인', '필요 서류 준비', '가상 신청 안내 확인', '담당 부서에 최종 문의'],
  },
  {
    id: 'return',
    category: '학적·복학',
    keywords: ['복학'],
    department: '가상 학사지원팀',
    phone: '02-000-1001',
    email: 'academic@example.edu',
    hours: '평일 09:00–17:00',
    location: '가상 행정관 1층',
    reason: '복학 신청 기간과 학적 복귀 절차에 관한 문의로 분류했습니다.',
    documents: ['복학신청서'],
    applicationUrl: 'https://example.edu/return',
    process: ['복학 신청 기간 확인', '복학신청서 준비', '가상 신청 안내 확인', '담당 부서에 최종 문의'],
  },
  {
    id: 'scholarship',
    category: '장학·학생지원',
    keywords: ['장학', '학자금', '등록금', '국가장학'],
    department: '가상 장학지원팀',
    phone: '02-000-1003',
    email: 'scholarship@example.edu',
    hours: '평일 09:00–17:00',
    location: '가상 학생회관 2층',
    reason: '교내외 장학금과 학자금 지원에 관한 문의로 분류했습니다.',
    documents: ['장학금 신청서', '가상 소득 확인 서류'],
    applicationUrl: 'https://example.edu/scholarship',
    process: ['모집 공고 확인', '지원 자격 확인', '필요 서류 준비', '가상 신청 안내 확인'],
  },
  {
    id: 'certificate',
    category: '증명서 발급',
    keywords: ['증명서', '성적증명', '재학증명', '졸업증명', '제증명'],
    department: '가상 증명서발급센터',
    phone: '02-000-1002',
    email: 'certificate@example.edu',
    hours: '평일 09:00–17:00',
    location: '가상 학생회관 1층',
    reason: '재학·성적·졸업 등 학교 증명서 발급에 관한 문의로 분류했습니다.',
    documents: ['학생번호 확인 정보'],
    applicationUrl: 'https://example.edu/certificate',
    process: ['필요한 증명서 선택', '가상 발급 안내 확인', '발급 방식 선택'],
  },
]

export function classifyInquiry(rawQuery) {
  const query = rawQuery.trim().toLowerCase()

  if (!query) {
    return { status: 'empty' }
  }

  const ranked = ROUTES.map((route) => ({
    route,
    score: route.keywords.reduce(
      (total, keyword) => total + (query.includes(keyword.toLowerCase()) ? 1 : 0),
      0,
    ),
  })).sort((a, b) => b.score - a.score)

  if (ranked[0].score === 0) {
    return {
      status: 'unmatched',
      query: rawQuery.trim(),
      message: '담당 부서를 찾을 수 없습니다. 가상 대표번호 02-000-0000으로 문의해 주세요.',
    }
  }

  return {
    status: 'matched',
    query: rawQuery.trim(),
    ...ranked[0].route,
  }
}

export function resultToText(result) {
  if (result.status !== 'matched') return result.message ?? ''

  return [
    `나의 문의: ${result.query}`,
    `문의 유형: ${result.category}`,
    `추천 담당 부서: ${result.department}`,
    `전화번호: ${result.phone}`,
    `이메일: ${result.email}`,
    `문의 가능 시간: ${result.hours}`,
    `위치: ${result.location}`,
    `추천 이유: ${result.reason}`,
    `필요 서류: ${result.documents.join(', ')}`,
    `가상 신청 링크: ${result.applicationUrl}`,
    `처리 절차: ${result.process.join(' → ')}`,
    '※ 가상 데이터로 생성된 규칙 기반 프로토타입 결과입니다.',
  ].join('\n')
}
