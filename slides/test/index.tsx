import { useEffect, useState } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#f8f7f4', text: '#1a1a2e', accent: '#6366f1' },
  fonts: {
    display: '"Pretendard", "Noto Sans KR", system-ui, -apple-system, sans-serif',
    body: '"Pretendard", "Noto Sans KR", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 160, body: 36 },
  radius: 16,
};

const muted = '#94a3b8';
const surface = '#f1f0ed';
const border = '#e2e1dd';

const fill = {
  width: '100%',
  height: '100%',
  fontFamily: 'var(--osd-font-body)',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  overflow: 'hidden',
  position: 'relative' as const,
};

const PageFooter = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 48,
        left: 120,
        right: 120,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--osd-font-body)',
        fontSize: 22,
        color: muted,
        borderTop: `1px solid ${border}`,
        paddingTop: 24,
      }}
    >
      <span>React로 슬라이드 만들기</span>
      <span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};

const SectionHeading = ({ number, title }: { number: string; title: string }) => (
  <div style={{ marginBottom: 20 }}>
    <div
      style={{
        fontSize: 22,
        fontWeight: 600,
        color: 'var(--osd-accent)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        marginBottom: 12,
      }}
    >
      {number}
    </div>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 80,
        fontWeight: 800,
        margin: 0,
        lineHeight: 1.15,
        letterSpacing: '-0.025em',
      }}
    >
      {title}
    </h2>
  </div>
);

const Cover: Page = () => (
  <div style={fill}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 160px',
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: 'var(--osd-accent)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          marginBottom: 24,
        }}
      >
        Slide Engineering
      </div>
      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 900,
          margin: 0,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
        }}
      >
        React로
        <br />
        <span style={{ color: 'var(--osd-accent)' }}>슬라이드</span> 만들기
      </h1>
      <p
        style={{
          marginTop: 40,
          fontSize: 'var(--osd-size-body)',
          color: muted,
          lineHeight: 1.5,
          maxWidth: 900,
        }}
      >
        컴포넌트 기반 프레젠테이션의 개념과 open-slide를 활용한 실전 워크플로우
      </p>
    </div>
    <PageFooter />
  </div>
);

const cardStyle = {
  background: surface,
  border: `1px solid ${border}`,
  borderRadius: 'var(--osd-radius)',
  padding: '40px 36px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 16,
};

const IconBox = ({ label }: { label: string }) => (
  <div
    style={{
      width: 48,
      height: 48,
      borderRadius: 12,
      background: 'var(--osd-accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0,
    }}
  >
    {label[0]}
  </div>
);

const WhyReact: Page = () => (
  <div style={fill}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '100px 120px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SectionHeading number="01" title="왜 React인가?" />

      <p style={{ fontSize: 32, color: muted, lineHeight: 1.5, margin: '0 0 48px', maxWidth: 1100 }}>
        React의 컴포넌트 모델은 슬라이드 제작에 완벽히 어울립니다. 재사용 가능한 UI 조각으로
        일관된 프레젠테이션을 빠르게 조립할 수 있습니다.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, flex: 1 }}>
        <div style={cardStyle}>
          <IconBox label="C" />
          <h3 style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>컴포넌트 기반</h3>
          <p style={{ fontSize: 24, color: muted, lineHeight: 1.5, margin: 0 }}>
            헤더, 푸터, 카드, 레이아웃을 각각 독립된 컴포넌트로 분리하여 조립합니다.
          </p>
        </div>
        <div style={cardStyle}>
          <IconBox label="D" />
          <h3 style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>선언적 UI</h3>
          <p style={{ fontSize: 24, color: muted, lineHeight: 1.5, margin: 0 }}>
            상태와 레이아웃을 명시적으로 선언하여 예측 가능하고 디버깅이 쉬운 슬라이드를 만듭니다.
          </p>
        </div>
        <div style={cardStyle}>
          <IconBox label="E" />
          <h3 style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>에코시스템</h3>
          <p style={{ fontSize: 24, color: muted, lineHeight: 1.5, margin: 0 }}>
            Vite, HMR, TypeScript, 수많은 UI 라이브러리와의 자연스러운 통합이 가능합니다.
          </p>
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
);

const commands = [
  'pnpm create vite my-slide --template react-ts',
  'pnpm add @open-slide/core',
  'pnpm dev',
];

const Setup: Page = () => {
  const [displayed, setDisplayed] = useState<string[]>(commands.map(() => ''));
  const [activeLine, setActiveLine] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let line = 0;
    let char = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const typeNext = () => {
      if (line >= commands.length) {
        setShowResult(true);
        clearInterval(intervalId);
        setTimeout(() => {
          setDisplayed(commands.map(() => ''));
          setActiveLine(0);
          setShowResult(false);
          line = 0;
          char = 0;
          intervalId = setInterval(typeNext, 55);
        }, 3500);
        return;
      }

      const cmd = commands[line];
      if (char >= cmd.length) {
        line++;
        char = 0;
        setActiveLine(line);
        return;
      }

      char++;
      const c = char;
      const l = line;
      setDisplayed((prev) => {
        const next = [...prev];
        next[l] = cmd.slice(0, c);
        return next;
      });
    };

    intervalId = setInterval(typeNext, 55);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={fill}>
      <style>{`
        @keyframes tw-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes tw-fadeIn {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .tw-cursor {
          display: inline-block;
          width: 0.06em;
          height: 0.85em;
          background: #68cc9a;
          margin-left: 2px;
          vertical-align: baseline;
          animation: tw-blink 0.8s steps(1) infinite;
        }
        .tw-result {
          animation: tw-fadeIn 0.4s ease-out forwards;
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '100px 120px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SectionHeading number="02" title="개발 환경 설정" />

        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: 48,
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: '#1a1a2e',
                borderRadius: 'var(--osd-radius)',
                padding: '40px 44px',
                fontFamily: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
                fontSize: 24,
                lineHeight: 1.6,
                color: '#e2e8f0',
              }}
            >
              <div style={{ color: '#6366f1', marginBottom: 20 }}>$</div>
              {commands.map((_, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', gap: 12, minHeight: 40 }}>
                    <span style={{ color: '#68cc9a' }}>$</span>
                    <span>
                      {displayed[idx]}
                      {activeLine === idx && !showResult && (
                        <span className="tw-cursor" />
                      )}
                    </span>
                  </div>
                  {idx < commands.length - 1 && <div style={{ height: 12 }} />}
                </div>
              ))}
              <div style={{ height: 24 }} />
              {showResult && (
                <div className="tw-result" style={{ color: muted }}>
                  → localhost:5173
                  <span className="tw-cursor" />
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <StepCard step="1" title="프로젝트 생성" detail="Vite + React + TypeScript 템플릿으로 시작합니다." />
            <StepCard step="2" title="패키지 설치" detail="open-slide와 필요한 의존성을 추가합니다." />
            <StepCard step="3" title="개발 서버 실행" detail="HMR로 즉시 결과를 확인하며 슬라이드를 작성합니다." />
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
};

const StepCard = ({ step, title, detail }: { step: string; title: string; detail: string }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'var(--osd-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {step}
    </div>
    <div>
      <h3 style={{ fontSize: 32, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: 24, color: muted, lineHeight: 1.5, margin: '6px 0 0' }}>{detail}</p>
    </div>
  </div>
);

const Building: Page = () => (
  <div style={fill}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '100px 120px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SectionHeading number="03" title="슬라이드 제작하기" />

      <p style={{ fontSize: 32, color: muted, lineHeight: 1.5, margin: '0 0 48px', maxWidth: 1200 }}>
        Page 컴포넌트와 DesignSystem을 선언하고, assets을 추가하여 완성도 높은 슬라이드를 만듭니다.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, flex: 1 }}>
        <FeatureCard
          icon="P"
          title="Page 컴포넌트"
          items={[
            '각 슬라이드는 하나의 Page 함수 컴포넌트',
            '1920 × 1080 고정 캔버스에 디자인',
            'Page[] 배열로 순서대로 export',
          ]}
        />
        <FeatureCard
          icon="D"
          title="DesignSystem"
          items={[
            '팔레트, 폰트, 타입스케일을 타입으로 정의',
            'var(--osd-*) CSS 변수로 실시간 조정',
            'Design 패널로 시각적 튜닝 가능',
          ]}
        />
        <FeatureCard
          icon="A"
          title="Assets 관리"
          items={[
            '슬라이드별 assets/ 폴더에 이미지 배치',
            '글로벌 assets/은 @assets 별칭으로 import',
            '드래그 앤 드롭으로 간편 업로드',
          ]}
        />
      </div>
    </div>
    <PageFooter />
  </div>
);

const FeatureCard = ({ icon, title, items }: { icon: string; title: string; items: string[] }) => (
  <div style={cardStyle}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
      <IconBox label={icon} />
      <h3 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>{title}</h3>
    </div>
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            fontSize: 22,
            color: muted,
            lineHeight: 1.5,
            paddingLeft: 24,
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: 10,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--osd-accent)',
            }}
          />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const Workflow: Page = () => (
  <div style={fill}>
    <style>{`
      @keyframes tw-slideUpFade {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes tw-float {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
      .tw-float {
        animation: tw-float 2s ease-in-out infinite;
      }
    `}</style>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '100px 120px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SectionHeading number="04" title="작업 흐름" />

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 28,
          alignContent: 'center',
        }}
      >
        <FlowStep
          step="01"
          title="기획"
          desc="주제와 페이지 수를 정하고 스토리보드를 작성합니다."
        />
        <FlowStep
          step="02"
          title="작성"
          desc="인라인 스타일로 컴포넌트를 작성하며 미리보기로 확인합니다."
        />
        <FlowStep
          step="03"
          title="수정"
          desc="Inspector로 요소를 선택하고 Design 패널로 스타일을 튜닝합니다."
        />
        <FlowStep
          step="04"
          title="발표"
          desc="F 풀스크린 플레이 모드로 발표하거나 PDF로 내보냅니다."
        />
      </div>

      <div
        style={{
          marginTop: 48,
          padding: '32px 40px',
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 'var(--osd-radius)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="tw-slideUpFade"
      >
<div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.4 }} className="tw-float">
    지금 바로 <span style={{ color: 'var(--osd-accent)' }}>slides/</span> 폴더에
    새로운 슬라이드를 만들어보세요!
  </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
            fontSize: 22,
            color: muted,
            background: '#1a1a2e',
            padding: '12px 24px',
            borderRadius: 10,
          }}
        >
          pnpm dev
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
);

const FlowStep = ({ step, title, desc }: { step: string; title: string; desc: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'var(--osd-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 700,
        color: '#fff',
      }}
    >
      {step}
    </div>
    <h3 style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{title}</h3>
    <p style={{ fontSize: 24, color: muted, lineHeight: 1.5, margin: 0, maxWidth: 360 }}>
      {desc}
    </p>
  </div>
);

export const meta: SlideMeta = {
  title: 'React로 슬라이드 만들기',
  createdAt: '2026-05-23T15:25:58.759Z',
};
export default [Cover, WhyReact, Setup, Building, Workflow] satisfies Page[];
