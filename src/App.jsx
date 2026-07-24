import { useRef, useState } from 'react'
import {
  analyzeInquiry,
  buildGuidance,
  REPRESENTATIVE_PHONE,
} from './classifier.js'

const samples = [
  {
    label: '전역 후 군 복학',
    text: '군 복무를 마치고 다음 학기에 복학하려고 합니다. 어떤 서류를 준비해야 하나요?',
  },
  {
    label: '자퇴 후 재입학',
    text: '2년 전에 자퇴했는데 다시 학교에 다니고 싶습니다. 재입학이 가능한가요?',
  },
  {
    label: '등록금·장학금 후 휴학',
    text: '등록금은 이미 냈고 장학금도 받았습니다. 개인 사정으로 이번 학기를 휴학하려면 어떤 절차가 필요한가요?',
  },
  {
    label: '등록금 납부 후 자퇴',
    text: '이번 학기 등록금을 낸 상태에서 자퇴하려고 합니다. 필요한 서류와 등록금 반환 절차가 궁금합니다.',
  },
  {
    label: '휴학 중 복학·전과',
    text: '현재 휴학 중입니다. 다음 학기에 복학하면서 다른 학과로 전과하려면 무엇부터 해야 하나요?',
  },
  {
    label: '휴학→복학→전과',
    text: '이번 학기에 휴학하고 다음 학기에 복학한 뒤 전과하려면 어떤 순서로 진행해야 하나요?',
  },
]

const scopeItems = ['휴학', '자퇴', '복학', '재입학', '전과']

const Icon = ({ name }) => {
  const paths = {
    arrow: <path d="m9 18 6-6-6-6" />,
    building: <><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    external: <><path d="M15 3h6v6M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
    info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
    lock: <><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z" /><path d="m9 12 2 2 4-4" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />,
    refresh: <><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 21v-5h5M3 12A9 9 0 0 1 18.5 5.8L21 8" /><path d="M21 3v5h-5" /></>,
    route: <><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M6 16V8a3 3 0 0 1 3-3h6M9 19h9" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    warning: <><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" /><path d="M12 9v4M12 17h.01" /></>,
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')
  const [clarificationError, setClarificationError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)

  const reset = () => {
    setQuery('')
    setResult(null)
    setAnswers({})
    setError('')
    setClarificationError('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const submit = async (event) => {
    event.preventDefault()
    const trimmed = query.trim()

    if (!trimmed) {
      setError('상황을 한 문장 이상 입력해 주세요.')
      setResult(null)
      inputRef.current?.focus()
      return
    }

    setError('')
    setClarificationError('')
    setAnswers({})
    setIsLoading(true)

    await new Promise((resolve) => window.setTimeout(resolve, 420))

    try {
      setResult(analyzeInquiry(trimmed))
    } catch {
      setResult({
        status: 'error',
        query: trimmed,
        message: `결과를 불러오지 못했습니다. 잠시 후 다시 시도하거나 대표번호(${REPRESENTATIVE_PHONE})로 문의해 주세요.`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmContext = () => {
    if (result?.status !== 'needs_clarification') return
    const unanswered = result.questions.filter((question) => !answers[question.id])

    if (unanswered.length > 0) {
      setClarificationError(`아직 ${unanswered.length}개 항목이 남아 있습니다. 모르면 ‘잘 모르겠어요’를 선택할 수 있습니다.`)
      return
    }

    setClarificationError('')
    setResult(buildGuidance(result, answers))
  }

  const selectSample = (sample) => {
    setQuery(sample)
    setResult(null)
    setAnswers({})
    setError('')
    setClarificationError('')
    inputRef.current?.focus()
  }

  const currentStep = result?.status === 'guided'
    ? 3
    : result?.status === 'needs_clarification'
      ? 2
      : 1

  return (
    <div className="app-shell" id="top">
      <a className="skip-link" href="#inquiry-form">상황 입력으로 바로가기</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Campus Guide 홈" onClick={reset}>
          <span className="brand-mark" aria-hidden="true">CG</span>
          <span>
            <strong>Campus Guide</strong>
            <small>학적변동 절차 내비게이터</small>
          </span>
        </a>
        <span className="prototype-badge">공식 안내 기반 프로토타입</span>
      </header>

      <main>
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">ACADEMIC ROUTE NAVIGATOR</p>
            <h1 id="page-title">규정을 찾는 대신,<br /><span>해야 할 일을</span><br />확인하세요.</h1>
            <p>학생의 상황을 휴학·자퇴·복학·재입학·전과 절차로 연결하고, 필요한 조건과 서류, 처리 순서, 공식 근거와 담당 부서를 한 번에 정리합니다.</p>
          </div>
          <aside className="simulation-note" aria-label="프로토타입 안내">
            <span><Icon name="info" /></span>
            <div>
              <strong>공식 안내 기반 시뮬레이션</strong>
              <p>공개된 학교 안내를 구조화한 시연용 결과입니다. 학생 개인의 최종 가능 여부는 담당 부서가 판단합니다.</p>
            </div>
          </aside>
        </section>

        <div className="scope-strip" aria-label="현재 안내 범위">
          <span>현재 안내 범위</span>
          <ul>{scopeItems.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>

        <ol className="steps" aria-label="서비스 이용 순서">
          {[
            ['상황 입력', '학생 표현 그대로'],
            ['조건 확인', '필요한 것만 질문'],
            ['처리 지도', '절차·서류·부서'],
          ].map(([title, description], index) => {
            const step = index + 1
            return (
              <li key={title} className={currentStep === step ? 'active' : currentStep > step ? 'complete' : ''}>
                <span>0{step}</span>
                <div><b>{title}</b><small>{description}</small></div>
              </li>
            )
          })}
        </ol>

        <section className="navigator-shell" aria-label="학적변동 절차 안내">
          <section className="input-panel">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <h2>지금 어떤 상황인가요?</h2>
                <p>행정 용어를 몰라도 실제로 담당자에게 말하듯 적어주세요.</p>
              </div>
            </div>

            <form id="inquiry-form" onSubmit={submit} noValidate>
              <label htmlFor="inquiry">나의 상황과 하려는 일 <span aria-hidden="true">*</span></label>
              <div className={`textarea-wrap ${error ? 'has-error' : ''}`}>
                <textarea
                  ref={inputRef}
                  id="inquiry"
                  value={query}
                  maxLength={500}
                  rows={6}
                  aria-describedby="inquiry-help inquiry-error"
                  aria-invalid={Boolean(error)}
                  placeholder="예: 휴학 중인데 다음 학기에 복학하면서 다른 학과로 전과하고 싶습니다."
                  onChange={(event) => {
                    setQuery(event.target.value)
                    if (error) setError('')
                  }}
                />
                <span className="character-count">{query.length}/500</span>
              </div>
              <p id="inquiry-help" className="field-help">여러 절차가 섞인 상황도 그대로 입력할 수 있습니다.</p>
              <p id="inquiry-error" className="field-error" role="alert">{error && <><Icon name="warning" /> {error}</>}</p>

              <div className="sample-block">
                <span>상황별 시연 예시</span>
                <div className="sample-list">
                  {samples.map((sample) => (
                    <button type="button" key={sample.label} onClick={() => selectSample(sample.text)}>
                      <strong>{sample.label}</strong>
                      <span>{sample.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button className="primary-button" type="submit" disabled={isLoading}>
                {isLoading
                  ? <><span className="spinner" /> 상황을 분석하고 있어요</>
                  : <><Icon name="route" /> 처리 경로 찾기 <Icon name="arrow" /></>}
              </button>
            </form>

            <div className="privacy-notice">
              <Icon name="lock" />
              <p><strong>이름·학번·전화번호를 입력하지 마세요.</strong> 현재 시연 버전은 입력과 결과를 브라우저 저장소에 보관하지 않습니다.</p>
            </div>
          </section>

          <section className={`route-panel ${result ? 'has-result' : ''}`} aria-live="polite">
            {isLoading ? <LoadingState />
              : !result ? <InitialState />
                : result.status === 'needs_clarification' ? (
                  <ClarificationState
                    analysis={result}
                    answers={answers}
                    setAnswers={setAnswers}
                    error={clarificationError}
                    onConfirm={confirmContext}
                    reset={reset}
                  />
                ) : result.status === 'guided' ? (
                  <GuidanceResult result={result} reset={reset} />
                ) : result.status === 'unmatched' ? (
                  <FallbackState result={result} reset={reset} />
                ) : (
                  <ErrorState result={result} reset={reset} />
                )}
          </section>
        </section>
      </main>

      <footer>
        <p>Campus Guide 시연 프로토타입 · 공개된 강남대학교 안내를 2026-07-24 기준으로 구조화했으며 최종 업무 판단은 담당 부서에 확인해야 합니다.</p>
      </footer>
    </div>
  )
}

function InitialState() {
  return (
    <div className="initial-state">
      <div className="route-illustration">
        <span><Icon name="document" /></span><i /><span><Icon name="route" /></span><i /><span><Icon name="check" /></span>
      </div>
      <p className="eyebrow">YOUR ACADEMIC ROUTE</p>
      <h2>한 문장을 실행 가능한 경로로 바꿉니다</h2>
      <p>문의 내용을 분석한 뒤 필요한 조건만 추가로 확인하고, 공식 근거가 있는 절차·서류·담당 부서를 순서대로 보여드립니다.</p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="loading-state" role="status">
      <span className="large-spinner" />
      <h2>상황에 맞는 절차를 찾고 있어요</h2>
      <p>한 문장에 여러 학적변동이 포함되어 있는지도 함께 확인합니다.</p>
    </div>
  )
}

function ClarificationState({ analysis, answers, setAnswers, error, onConfirm, reset }) {
  return (
    <div className="clarification-state">
      <div className="result-topline">
        <span className="result-label">상황 확인</span>
        <span className={analysis.isComplex ? 'complex-label' : 'verified-label'}>
          {analysis.isComplex ? '복합 문의 감지' : '절차 후보 확인'}
        </span>
      </div>

      <div className="analysis-heading">
        <p className="category">{analysis.topics.map((topic) => topic.label).join(' · ')}</p>
        <h2>{analysis.isComplex ? '여러 절차를 연결해 안내할게요' : `${analysis.topics[0].label} 절차를 확인할게요`}</h2>
        <p>{analysis.message}</p>
      </div>

      <div className="query-box"><span>입력한 상황</span><p>“{analysis.query}”</p></div>

      <div className="detected-topics">
        {analysis.topics.map((topic, index) => (
          <div key={topic.id}>
            <span>0{index + 1}</span>
            <strong>{topic.label}</strong>
            <p>{topic.overview}</p>
          </div>
        ))}
      </div>

      {(analysis.inferredContext ?? []).length > 0 && (
        <section className="inferred-context" aria-labelledby="inferred-context-title">
          <div>
            <span>문장 분석</span>
            <h3 id="inferred-context-title">이미 확인한 내용은 다시 묻지 않아요</h3>
          </div>
          <ul>
            {(analysis.inferredContext ?? []).map((item) => (
              <li key={item.id}><b>{item.label}</b><span>{item.value}</span></li>
            ))}
          </ul>
        </section>
      )}

      <div className="question-stack">
        {analysis.questions.map((question, questionIndex) => (
          <fieldset key={question.id}>
            <legend><span>{questionIndex + 1}</span>{question.label}</legend>
            <p>{question.help}</p>
            <div className="option-grid">
              {question.options.map((option) => (
                <label key={option.value} className={answers[question.id] === option.value ? 'selected' : ''}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {error && <p className="clarification-error" role="alert"><Icon name="warning" />{error}</p>}

      <div className="button-row">
        <button className="primary-button" type="button" onClick={onConfirm}><Icon name="route" /> 나의 처리 지도 만들기</button>
        <button className="text-button" type="button" onClick={reset}>처음부터 다시 입력</button>
      </div>
    </div>
  )
}

function GuidanceResult({ result, reset }) {
  return (
    <div className="guidance-result">
      <div className="result-topline">
        <span className="result-label">나의 학적변동 처리 지도</span>
        <span className="verified-label">공식 안내 기반</span>
      </div>

      <div className="guidance-hero">
        <div>
          <p className="category">{result.isComplex ? 'COMPLEX ROUTE' : 'ACADEMIC ROUTE'}</p>
          <h2>{result.title}</h2>
          <p>{result.summary}</p>
        </div>
        <span className="route-count"><strong>{result.sections.length}</strong>개 절차</span>
      </div>

      <div className="query-box"><span>나의 문의</span><p>“{result.query}”</p></div>

      {result.context.length > 0 && (
        <section className="context-summary">
          <h3>반영한 상황</h3>
          <div>{result.context.map((item) => <span key={item.id}><b>{item.label}</b>{item.value}</span>)}</div>
        </section>
      )}

      {result.coordinationNotes.length > 0 && (
        <section className="coordination-card">
          <Icon name="route" />
          <div>
            <h3>복합 절차의 선후관계</h3>
            <ul>{result.coordinationNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          </div>
        </section>
      )}

      <div className="route-sections">
        {result.sections.map((section, index) => (
          <article className="route-section" key={section.id}>
            <header>
              <span>ROUTE {String(index + 1).padStart(2, '0')}</span>
              <div><strong>{section.label}</strong><p>{section.overview}</p></div>
              <a href={section.source.url} target="_blank" rel="noreferrer">공식 안내 <Icon name="external" /></a>
            </header>

            <div className="route-detail-grid">
              <section>
                <h3><Icon name="info" /> 신청 전 확인</h3>
                <ul className="bullet-list">{section.conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul>
              </section>
              <section>
                <h3><Icon name="document" /> 필요 서류</h3>
                <ul className="check-list">{section.documents.map((document) => <li key={document}><Icon name="check" />{document}</li>)}</ul>
              </section>
            </div>

            <section className="process-map">
              <h3>처리 순서</h3>
              <ol>{section.process.map((step, stepIndex) => <li key={step}><span>{stepIndex + 1}</span><p>{step}</p></li>)}</ol>
            </section>

            {section.warnings.length > 0 && (
              <aside className="warning-box">
                <Icon name="warning" />
                <div><strong>주의·최종 확인</strong><ul>{section.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>
              </aside>
            )}
          </article>
        ))}
      </div>

      <section className="department-section">
        <div className="subsection-title">
          <div><Icon name="building" /></div>
          <span><small>필요할 때 최종 확인</small><strong>소속별 담당 교학팀</strong></span>
        </div>
        <div className="contact-list">
          {result.contacts.map((contact) => (
            <article key={contact.id}>
              <span>{contact.label}</span>
              <h3>{contact.department}</h3>
              <p>{contact.description}</p>
              <div><a href={`tel:${contact.phone.split('~')[0]}`}><Icon name="phone" />{contact.phone}</a><b>{contact.location}</b></div>
            </article>
          ))}
        </div>
      </section>

      <section className="source-section">
        <div className="source-heading">
          <div>
            <p className="eyebrow">OFFICIAL SOURCES</p>
            <h3>안내 근거</h3>
          </div>
          <span>프로토타입 확인일 {result.verifiedAt}</span>
        </div>
        <ul>
          {result.sources.map((source) => (
            <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<Icon name="external" /></a></li>
          ))}
        </ul>
        <p>원문이 변경되거나 원문끼리 다를 경우 최신 공식 안내와 담당 부서의 답변을 우선합니다.</p>
      </section>

      <div className="next-action">
        <span>지금 할 일</span>
        <p>{result.nextAction}</p>
      </div>

      <button className="secondary-button" type="button" onClick={reset}><Icon name="refresh" /> 다른 상황 확인하기</button>
    </div>
  )
}

function FallbackState({ result, reset }) {
  return (
    <div className="fallback-state">
      <span className="status-icon"><Icon name="search" /></span>
      <p className="eyebrow">현재 시연 범위 밖의 문의</p>
      <h2>학적변동 절차를 찾지 못했습니다</h2>
      <p>{result.message}</p>
      <div className="query-box"><span>입력한 상황</span><p>“{result.query}”</p></div>
      <div className="representative-card"><span>학교 대표번호</span><strong>{result.representativePhone}</strong></div>
      <button className="primary-button compact" type="button" onClick={reset}>다른 상황 입력하기</button>
    </div>
  )
}

function ErrorState({ result, reset }) {
  return (
    <div className="fallback-state error-state">
      <span className="status-icon"><Icon name="warning" /></span>
      <p className="eyebrow">일시적인 오류</p>
      <h2>처리 지도를 생성하지 못했습니다</h2>
      <p>{result.message}</p>
      <button className="primary-button compact" type="button" onClick={reset}>문의 내용 수정하기</button>
    </div>
  )
}

export default App
