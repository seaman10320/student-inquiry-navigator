import { useMemo, useState } from 'react'
import { classifyInquiry } from './classifier.js'

const SAMPLE_QUERIES = [
  '다음 학기에 휴학하려면 어떻게 해야 하나요?',
  '교내 장학금 신청 기간과 서류를 알려주세요.',
  '성적증명서를 온라인으로 발급받고 싶어요.',
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [linkNotice, setLinkNotice] = useState('')

  const characters = useMemo(() => query.length, [query])

  const submit = (event) => {
    event.preventDefault()
    setLinkNotice('')

    try {
      const nextResult = classifyInquiry(query)
      if (nextResult.status === 'empty') {
        setError('문의 내용을 입력해 주세요.')
        setResult(null)
        return
      }

      setError('')
      setResult(nextResult)
    } catch {
      setError('')
      setResult({
        status: 'error',
        message: '결과를 불러오지 못했습니다. 잠시 후 다시 시도하거나 가상 대표번호 02-000-0000으로 문의해 주세요.',
      })
    }
  }

  const chooseSample = (sample) => {
    setQuery(sample)
    setError('')
    setResult(null)
    setLinkNotice('')
  }

  const reset = () => {
    setQuery('')
    setResult(null)
    setError('')
    setLinkNotice('')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="바로문의 홈">
          <span className="brand-mark">바</span>
          <span>바로문의</span>
        </a>
        <span className="prototype-badge">P0 프로토타입</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">학생 문의 길잡이</p>
            <h1>
              어디에 물어볼지 몰라도,
              <br />한 번에 <em>바로.</em>
            </h1>
            <p className="hero-description">
              학교생활 문의를 적으면 담당 부서와 연락처, 필요한 서류와 처리 절차를
              한눈에 보여드립니다.
            </p>
          </div>
          <div className="hero-note" role="note">
            <span className="note-dot" />
            <div>
              <strong>규칙 기반 시뮬레이션</strong>
              <p>현재 결과와 부서 연락처는 가상 정보이며 실제 담당자 확인이 필요합니다.</p>
            </div>
          </div>
        </section>

        <ol className="steps" aria-label="서비스 이용 순서">
          <li className={!result ? 'active' : 'complete'}><span>1</span><b>문의 입력</b></li>
          <li className={result ? 'active' : ''}><span>2</span><b>담당 부서 확인</b></li>
          <li className={result?.status === 'matched' ? 'active' : ''}><span>3</span><b>다음 행동 선택</b></li>
        </ol>

        <section className="workspace" aria-label="담당 부서 찾기">
          <div className="input-panel">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <h2>무엇이 궁금한가요?</h2>
                <p>부서명이나 행정 용어를 몰라도 평소 표현으로 적어주세요.</p>
              </div>
            </div>

            <form onSubmit={submit} noValidate>
              <label htmlFor="inquiry">문의 내용</label>
              <div className={`textarea-wrap ${error ? 'has-error' : ''}`}>
                <textarea
                  id="inquiry"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value.slice(0, 160))
                    setError('')
                  }}
                  placeholder="예: 휴학 신청을 하려면 어떤 서류가 필요한가요?"
                  aria-describedby={error ? 'input-error privacy-help' : 'privacy-help'}
                />
                <span className="character-count">{characters}/160</span>
              </div>
              {error && <p id="input-error" className="error-text" role="alert">{error}</p>}
              <p id="privacy-help" className="privacy-help">
                이름·학번·전화번호 등 개인정보는 입력하지 마세요.
              </p>

              <div className="sample-block">
                <span>가상 문의 예시</span>
                <div className="sample-list">
                  {SAMPLE_QUERIES.map((sample) => (
                    <button key={sample} type="button" onClick={() => chooseSample(sample)}>
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <button className="primary-button" type="submit">
                담당 부서 찾기 <ArrowIcon />
              </button>
            </form>
          </div>

          <aside className={`result-panel ${result ? 'has-result' : ''}`} aria-live="polite">
            {!result && (
              <div className="empty-result">
                <div className="route-illustration" aria-hidden="true">
                  <span>?</span><i /><span>✓</span>
                </div>
                <h2>문의 경로를 정리해 드릴게요</h2>
                <p>문의 내용을 입력하면 담당 부서와 연락처, 다음 절차가 여기에 표시됩니다.</p>
              </div>
            )}

            {result?.status === 'unmatched' && (
              <div className="unmatched-result">
                <span className="status-icon">!</span>
                <p className="result-kicker">확인 필요</p>
                <h2>담당 부서를 확정하기 어렵습니다</h2>
                <p>{result.message}</p>
                <div className="query-quote">“{result.query}”</div>
                <p className="human-check">정확하지 않은 부서를 임의로 추천하지 않았습니다.</p>
                <button className="secondary-button" type="button" onClick={reset}>문의 다시 입력</button>
              </div>
            )}

            {result?.status === 'error' && (
              <div className="unmatched-result">
                <span className="status-icon">!</span>
                <p className="result-kicker">시스템 오류</p>
                <h2>결과를 불러오지 못했습니다</h2>
                <p>{result.message}</p>
                <button className="secondary-button" type="button" onClick={reset}>문의 다시 입력</button>
              </div>
            )}

            {result?.status === 'matched' && (
              <div className="matched-result">
                <div className="result-topline">
                  <span className="result-kicker">추천 경로</span>
                  <span className="simulation-label">가상 정보</span>
                </div>
                <p className="category">{result.category}</p>
                <h2>{result.department}</h2>
                <p className="reason">{result.reason}</p>

                <div className="query-quote result-query">
                  <span>나의 문의 내용</span>
                  <p>“{result.query}”</p>
                </div>

                <div className="contact-grid detail-grid">
                  <div><span>전화번호</span><strong>{result.phone}</strong></div>
                  <div><span>이메일</span><strong>{result.email}</strong></div>
                  <div><span>문의 가능 시간</span><strong>{result.hours}</strong></div>
                  <div><span>위치</span><strong>{result.location}</strong></div>
                </div>

                <div className="prepare-box">
                  <h3>필요 서류</h3>
                  <ul>
                    {result.documents.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>

                <div className="process-box">
                  <h3>처리 절차</h3>
                  <ol>
                    {result.process.map((item) => <li key={item}>{item}</li>)}
                  </ol>
                </div>

                <div className="application-box">
                  <div>
                    <span>가상 신청 링크</span>
                    <strong>{result.applicationUrl}</strong>
                  </div>
                  <button type="button" onClick={() => setLinkNotice('실제 학교 시스템으로 이동하지 않는 시연용 가상 링크입니다.')}>
                    가상 신청 링크 확인
                  </button>
                </div>
                {linkNotice && <p className="link-notice" role="status">{linkNotice}</p>}

                <div className="next-action">
                  <span>다음 행동</span>
                  <p>추천 내용이 문의와 맞는지 확인한 뒤 표시된 연락처로 직접 문의하거나 안내된 절차를 진행하세요.</p>
                </div>

                <p className="human-check">추천된 부서와 안내 내용이 문의와 맞는지 확인해 주세요. 실제 담당 업무와 연락처는 학교 공식 안내에서 다시 확인해야 합니다.</p>

                <div className="result-actions">
                  <button className="primary-button" type="button" onClick={reset}>다른 문의하기</button>
                </div>
              </div>
            )}
          </aside>
        </section>

      </main>

      <footer>
        <p>바로문의 시범 서비스 · 실제 개인정보와 학교 원본 자료를 사용하지 않습니다.</p>
      </footer>
    </div>
  )
}

export default App
