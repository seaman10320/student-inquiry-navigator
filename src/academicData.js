export const VERIFIED_AT = '2026-07-24'

export const OFFICIAL_SOURCES = {
  regulations: {
    label: '강남대학교 대학 규정집',
    url: 'https://app.kangnam.ac.kr/knumis/mo_open/index.jsp',
  },
  contacts: {
    label: '강남대학교 통합전화번호부',
    url: 'https://web.kangnam.ac.kr/menu/d32b0ae4b98a62cad835c588275d3407.do',
  },
  leave: {
    label: '강남대학교 휴학 안내',
    url: 'https://web.kangnam.ac.kr/menu/12d2ee44cc4e95562f84a01bf953a054.do?encMenuSeq=95ab57ae199df28a4812e34d2267ae25',
  },
  return: {
    label: '강남대학교 복학 안내',
    url: 'https://web.kangnam.ac.kr/menu/12d2ee44cc4e95562f84a01bf953a054.do?encMenuSeq=a2643e9dc95f1078bfec0078c09a6ac2',
  },
  withdrawal: {
    label: '강남대학교 자퇴 안내',
    url: 'https://web.kangnam.ac.kr/menu/41c4ba211ab06cbc003455e07441b4f8.do?encMenuSeq=68d833d94c47988fc5697afe26b3f24e',
  },
  readmission: {
    label: '강남대학교 재입학 안내',
    url: 'https://web.kangnam.ac.kr/menu/41c4ba211ab06cbc003455e07441b4f8.do?encMenuSeq=57e44917a12b17cbdb4738db7cfaab86',
  },
  transfer: {
    label: '강남대학교 전부·전과 안내',
    url: 'https://web.kangnam.ac.kr/menu/41c4ba211ab06cbc003455e07441b4f8.do?encMenuSeq=3a4030700fef59422915dadc03f67b33',
  },
}

export const COLLEGE_GROUPS = [
  {
    id: 'college1',
    label: '교학1팀 소속',
    description: '복지융합대학 · 경영관리대학 · 예체능대학',
    department: '교학1팀 학적 담당',
    phone: '031-280-3873',
    location: '샬롬관 109호',
  },
  {
    id: 'college2',
    label: '교학2팀 소속',
    description: '글로벌문화콘텐츠대학 · 공과대학 · 사범대학',
    department: '교학2팀 학적 담당',
    phone: '031-280-3461',
    location: '경천관 105호',
  },
  {
    id: 'freeMajor',
    label: '자유전공학부',
    description: '자유전공학부',
    department: '자유전공학부 교학팀',
    phone: '031-899-7226~7',
    location: '샬롬관 203호',
  },
]

export const QUESTION_LIBRARY = {
  collegeGroup: {
    id: 'collegeGroup',
    label: '소속 단과대학은 어디인가요?',
    help: '학적 업무 담당 교학팀을 정확히 찾기 위해 필요합니다.',
    options: [
      { value: 'college1', label: '복지융합·경영관리·예체능' },
      { value: 'college2', label: '글로벌문화콘텐츠·공과·사범' },
      { value: 'freeMajor', label: '자유전공학부' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  leaveType: {
    id: 'leaveType',
    label: '어떤 사유의 휴학인가요?',
    help: '휴학 유형에 따라 신청 방법과 제출 서류가 달라집니다.',
    options: [
      { value: 'general', label: '일반휴학' },
      { value: 'illness', label: '질병휴학' },
      { value: 'military', label: '입대휴학' },
      { value: 'family', label: '임신·출산·육아휴학' },
      { value: 'startup', label: '창업휴학' },
      { value: 'unknown', label: '아직 모르겠어요' },
    ],
  },
  firstTerm: {
    id: 'firstTerm',
    label: '신입·편입·재입학 후 첫 학기인가요?',
    help: '첫 학기에는 일반휴학이 제한될 수 있습니다.',
    options: [
      { value: 'yes', label: '네' },
      { value: 'no', label: '아니요' },
      { value: 'unknown', label: '확인 필요' },
    ],
  },
  tuitionScholarship: {
    id: 'tuitionScholarship',
    label: '등록금이나 장학금 처리가 함께 필요한가요?',
    help: '관련 여부를 처리 지도에 반영하며, 정확한 금액·유지·반환 기준은 공식 안내와 담당 부서에서 확인해야 합니다.',
    options: [
      { value: 'both', label: '등록금 납부·장학금 수혜 모두 해당' },
      { value: 'tuition', label: '등록금만 납부' },
      { value: 'scholarship', label: '장학금만 해당' },
      { value: 'none', label: '둘 다 해당 없음' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  returnType: {
    id: 'returnType',
    label: '어떤 복학인가요?',
    help: '군 복학은 전역 관련 서류와 수업 참여 가능 시점을 확인해야 합니다.',
    options: [
      { value: 'general', label: '일반 복학' },
      { value: 'military', label: '군 복학' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  separationReason: {
    id: 'separationReason',
    label: '이전에 학교를 떠난 사유는 무엇인가요?',
    help: '재입학 가능 여부와 심사 기준 확인에 필요합니다.',
    options: [
      { value: 'withdrawal', label: '자퇴' },
      { value: 'unregistered', label: '미등록·미복학 제적' },
      { value: 'academic', label: '학사경고·전과목 과락 등 제적' },
      { value: 'disciplinary', label: '징계 퇴학' },
      { value: 'unknown', label: '정확히 모르겠어요' },
    ],
  },
  completedTerms: {
    id: 'completedTerms',
    label: '현재까지 2개 학기 이상 이수했나요?',
    help: '전과 신청 자격 확인에 필요합니다.',
    options: [
      { value: 'yes', label: '네' },
      { value: 'no', label: '아니요' },
      { value: 'unknown', label: '확인 필요' },
    ],
  },
  gradeRequirement: {
    id: 'gradeRequirement',
    label: '전체 평균평점이 2.5 이상인가요?',
    help: '일부 예외를 제외한 전과 기본 성적 요건입니다.',
    options: [
      { value: 'yes', label: '네' },
      { value: 'no', label: '아니요' },
      { value: 'unknown', label: '확인 필요' },
    ],
  },
  international: {
    id: 'international',
    label: '외국인 유학생인가요?',
    help: '자퇴 전 대외교류센터 상담 절차가 추가될 수 있습니다.',
    options: [
      { value: 'yes', label: '네' },
      { value: 'no', label: '아니요' },
      { value: 'unknown', label: '확인 필요' },
    ],
  },
}

export const ACADEMIC_ROUTES = [
  {
    id: 'leave',
    label: '휴학',
    category: '학적변동',
    directTerms: ['휴학', '휴학원', '군 휴학', '입대휴학', '질병휴학'],
    semanticPatterns: ['학교를 잠시 쉬', '한 학기 쉬', '학기를 쉬', '학업을 잠시 중단', '군대 가서 학교', '당분간 학교를 못 다'],
    questionIds: ['collegeGroup', 'leaveType', 'firstTerm', 'tuitionScholarship'],
    overview: '휴학 유형과 현재 학적·등록 상태를 확인한 뒤 신청 경로를 안내합니다.',
    conditions: [
      '일반휴학은 재학 중 총 3회까지 신청할 수 있습니다.',
      '신입·편입·재입학생의 첫 학기와 9학기 이상 등록자는 일반휴학이 제한될 수 있습니다.',
      '휴학 유형별로 신청 기간, 제출 서류와 신청 방식이 다릅니다.',
    ],
    baseDocuments: ['본인의 휴학 유형을 확인할 수 있는 정보'],
    baseProcess: ['휴학 유형·신청 기간 확인', '필요 증빙서류 준비', '지정된 시스템 또는 부서에서 신청', '학과장 승인과 최종 처리 상태 확인'],
    baseWarnings: ['모바일 신청이 불가능한 유형이 있으므로 공식 안내의 신청 방식을 확인하세요.'],
    sourceKey: 'leave',
  },
  {
    id: 'withdrawal',
    label: '자퇴',
    category: '학적변동',
    directTerms: ['자퇴', '자퇴원서'],
    semanticPatterns: ['학교를 완전히 그만두', '학교 그만두려고', '학업을 완전히 중단', '학교를 나가려고'],
    questionIds: ['collegeGroup', 'tuitionScholarship', 'international'],
    overview: '본인 방문이 필요한 자퇴 절차와 상담·등록금 반환 조건을 안내합니다.',
    conditions: [
      '본인이 학과장 및 전공주임교수와 상담한 후 소속 교학팀에 직접 제출해야 합니다.',
      '대리·팩스·이메일 접수는 허용되지 않습니다.',
      '등록금 반환액은 학기 진행 시점에 따라 달라집니다.',
    ],
    baseDocuments: ['보호자 연서가 포함된 자퇴원서', '본인 신분증'],
    baseProcess: ['자퇴원서 작성', '학과장·전공주임교수 상담', '신분증과 필요 서류 준비', '본인이 소속 교학팀 방문 제출', '등록금 반환·학적 처리 결과 확인'],
    baseWarnings: ['점심시간(12:00~13:00)에는 처리가 불가능하다고 안내되어 있습니다.'],
    sourceKey: 'withdrawal',
  },
  {
    id: 'return',
    label: '복학',
    category: '학적변동',
    directTerms: ['복학', '복학원', '군 복학'],
    semanticPatterns: ['다시 학교를 다니', '휴학이 끝나', '학교로 돌아가', '군대 다녀와서 학교', '다음 학기에 돌아'],
    questionIds: ['collegeGroup', 'returnType'],
    overview: '복학 유형과 신청 기간을 확인하고 등록·수강신청까지 이어지는 경로를 안내합니다.',
    conditions: [
      '학사일정에서 정한 복학 신청 기간에 종합정보시스템으로 신청합니다.',
      '1차 복학 신청을 완료해야 예비수강신청과 1차 수강신청에 참여할 수 있습니다.',
      '군 복학은 전역일과 수업 참여 가능 시점에 따라 추가 확인이 필요합니다.',
    ],
    baseDocuments: ['일반 복학은 별도 서류가 없는지 공식 안내에서 최종 확인'],
    baseProcess: ['복학 신청 기간 확인', '종합정보시스템에서 복학 신청', '승인 상태 확인', '등록금 납부', '수강신청'],
    baseWarnings: ['모바일 신청과 방문 접수가 불가능하다고 안내되어 있습니다.'],
    sourceKey: 'return',
  },
  {
    id: 'readmission',
    label: '재입학',
    category: '학적변동',
    directTerms: ['재입학', '다시 입학'],
    semanticPatterns: ['자퇴했는데 다시 학교', '제적됐는데 다시', '학교를 그만뒀다가 다시', '예전에 다니다가 다시 입학'],
    questionIds: ['collegeGroup', 'separationReason'],
    overview: '이전 학적 종료 사유와 모집 여석을 확인한 뒤 재입학 심사·등록 절차를 안내합니다.',
    conditions: [
      '자퇴 또는 제적된 학생이 재적했던 학부(과)로 재입학을 신청하는 제도입니다.',
      '재입학은 2회까지 신청할 수 있으며 매학기 여석과 심사를 거칩니다.',
      '재학연한 초과 제적자는 재입학이 허용되지 않으며 징계 퇴학은 제한될 수 있습니다.',
    ],
    baseDocuments: ['재입학 모집 공고에서 요구하는 신청 정보', '상황에 따라 전과목 과락학기 포기원'],
    baseProcess: ['재입학 일정·여석 확인', '종합정보시스템에서 재입학 신청', '재입학심사위원회 심의', '합격자 발표 확인', '재입학금·등록금 납부', '수강신청'],
    baseWarnings: ['합격 후 기간 내 등록금을 내지 않으면 허가가 취소되고, 등록 후 수강신청을 하지 않으면 제적될 수 있습니다.'],
    sourceKey: 'readmission',
  },
  {
    id: 'transfer',
    label: '전과',
    category: '학적변동',
    directTerms: ['전과', '전부전과', '전부·전과'],
    semanticPatterns: ['학과를 바꾸', '전공을 옮기', '다른 학과로 가', '다른 학과로 옮기', '소속 학부를 변경', '다른 전공으로 옮기'],
    questionIds: ['collegeGroup', 'completedTerms', 'gradeRequirement'],
    overview: '이수 학기와 성적·지원 제한을 확인한 뒤 전과 신청과 승인 경로를 안내합니다.',
    conditions: [
      '2학기 이상 이수하고 차기 학기가 3~6번째 학기인 학생이 기본 신청 대상입니다.',
      '전체 평균평점 2.5 이상이 기본 요건이며 일부 예외가 있습니다.',
      '사범대학은 학과별 여석이 있는 경우에만 신청할 수 있고 일부 모집단위는 제한됩니다.',
    ],
    baseDocuments: ['종합정보시스템에서 전체 평균평점 확인', '전입 희망 학부(과)의 별도 요구사항 확인'],
    baseProcess: ['신청 자격·여석 확인', '종합정보시스템 학적변동관리에서 신청', '전입 학부(과)장 승인', '최종 허가 확인', '변경된 교육과정·등록금·수강신청 확인'],
    baseWarnings: ['전입 학부(과)장 승인 후에는 전과 취소가 불가능하다고 안내되어 있습니다.'],
    sourceKey: 'transfer',
  },
]
