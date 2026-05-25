import { useEffect, useRef, useState } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

export const design: DesignSystem = {
  palette: {
    bg: '#07090d',
    text: '#f4f7fb',
    accent: '#88d7ff',
  },
  fonts: {
    display: '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", system-ui, -apple-system, sans-serif',
    body: '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", system-ui, -apple-system, sans-serif',
  },
  typeScale: {
    hero: 164,
    body: 36,
  },
  radius: 18,
};

const palette = {
  bg: design.palette.bg,
  text: design.palette.text,
  accent: design.palette.accent,
  accent2: '#7ee0a6',
  accent3: '#f7c66e',
  accent4: '#9e8cff',
  surface: '#0d1118',
  surface2: '#111722',
  surface3: '#151d2a',
  surface4: '#1b2432',
  textSoft: '#dfe6ef',
  muted: '#9aa5b5',
  dim: '#5a6474',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
};

const font = {
  display: design.fonts.display,
  body: design.fonts.body,
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
};

const fill = {
  width: '100%',
  height: '100%',
  position: 'relative' as const,
  overflow: 'hidden' as const,
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  letterSpacing: '-0.02em',
};

const styles = `
  @keyframes sv-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes sv-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes sv-float {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50%      { transform: translate3d(0, -12px, 0); }
  }
  @keyframes sv-drift {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50%      { transform: translate3d(18px, -10px, 0) scale(1.04); }
  }
  @keyframes sv-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(136, 215, 255, 0.0); }
    50%      { box-shadow: 0 0 0 10px rgba(136, 215, 255, 0.10); }
  }
  @keyframes sv-scan {
    0%   { transform: translateY(-100%); opacity: 0; }
    15%  { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }
  @keyframes sv-lineGrow {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  @keyframes sv-caret {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  .sv-fadeUp { opacity: 0; animation: sv-fadeUp 0.9s cubic-bezier(.2,.75,.2,1) forwards; }
  .sv-fadeIn { opacity: 0; animation: sv-fadeIn 1.1s ease forwards; }
  .sv-float { animation: sv-float 9s ease-in-out infinite; }
  .sv-drift { animation: sv-drift 12s ease-in-out infinite; }
  .sv-pulse { animation: sv-pulse 2.8s ease-in-out infinite; }
  .sv-scan {
    position: absolute;
    inset: -30% 0 auto 0;
    height: 60%;
    background: linear-gradient(180deg, transparent, rgba(136, 215, 255, 0.10), transparent);
    mix-blend-mode: screen;
    pointer-events: none;
    animation: sv-scan 8s linear infinite;
  }
  .sv-lineGrow {
    transform-origin: left center;
    animation: sv-lineGrow 1.05s cubic-bezier(.2,.75,.2,1) forwards;
  }
  .sv-caret::after {
    content: '';
    display: inline-block;
    width: 0.065em;
    height: 0.92em;
    margin-left: 0.08em;
    background: currentColor;
    vertical-align: -0.12em;
    animation: sv-caret 1.05s steps(1) infinite;
  }
`;

const staticPreviewStyles = `
  .sv-fadeUp,
  .sv-fadeIn,
  .sv-float,
  .sv-drift,
  .sv-pulse,
  .sv-scan,
  .sv-lineGrow,
  .sv-caret::after {
    animation: none !important;
  }
  .sv-fadeUp,
  .sv-fadeIn,
  .sv-lineGrow {
    opacity: 1 !important;
    transform: none !important;
  }
`;

const isStaticPreviewMode = () =>
  typeof window !== 'undefined' &&
  window.location.pathname.startsWith('/s/') &&
  !window.location.pathname.endsWith('/presenter');

const Styles = () => <style>{isStaticPreviewMode() ? `${styles}\n${staticPreviewStyles}` : styles}</style>;

const GridBg = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '88px 88px',
      opacity: 0.55,
      maskImage: 'radial-gradient(circle at center, black 0%, transparent 72%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 72%)',
    }}
  />
);

const Blobs = () => (
  <>
    <div
      className="sv-drift"
      style={{
        position: 'absolute',
        width: 620,
        height: 620,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(136,215,255,0.18) 0%, rgba(136,215,255,0.02) 58%, transparent 72%)',
        top: -140,
        right: -120,
        filter: 'blur(16px)',
      }}
    />
    <div
      className="sv-float"
      style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(126,224,166,0.16) 0%, rgba(126,224,166,0.02) 58%, transparent 70%)',
        bottom: -180,
        left: -120,
        filter: 'blur(10px)',
      }}
    />
  </>
);

const SectionTitle = ({
  kicker,
  title,
  subtitle,
  align = 'left',
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) => (
  <div style={{ textAlign: align, maxWidth: align === 'center' ? 1000 : 1200 }}>
    <div
      className="sv-fadeUp"
      style={{
        fontFamily: font.mono,
        fontSize: 22,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: palette.muted,
        marginBottom: 18,
      }}
    >
      {kicker}
    </div>
    <h2
      className="sv-fadeUp"
      style={{
        fontFamily: font.display,
        fontSize: 84,
        lineHeight: 1.06,
        letterSpacing: '-0.04em',
        margin: 0,
        fontWeight: 850,
      }}
    >
      {title}
    </h2>
    {subtitle ? (
      <p
        className="sv-fadeUp"
        style={{
          margin: '22px 0 0',
          fontSize: 34,
          lineHeight: 1.55,
          color: palette.muted,
          maxWidth: 1120,
        }}
      >
        {subtitle}
      </p>
    ) : null}
  </div>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();

  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        borderTop: `1px solid ${palette.border}`,
        color: palette.muted,
        fontFamily: font.body,
        fontSize: 20,
      }}
    >
      <span>slides/slidev.sh</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Card = ({
  title,
  body,
  badge,
  delay = 0,
  tone = 'accent',
  className,
}: {
  title: string;
  body: string;
  badge: string;
  delay?: number;
  tone?: 'accent' | 'green' | 'amber' | 'violet';
  className?: string;
}) => {
  const toneColor = {
    accent: palette.accent,
    green: palette.accent2,
    amber: palette.accent3,
    violet: palette.accent4,
  }[tone];

  return (
    <div
      className={`sv-fadeUp ${className ?? ''}`}
      style={{
        animationDelay: `${delay}ms`,
        background: `linear-gradient(180deg, ${palette.surface2}, ${palette.surface})`,
        border: `1px solid ${palette.border}`,
        borderRadius: 22,
        padding: 28,
        minHeight: 220,
        boxShadow: '0 22px 70px -40px rgba(0,0,0,0.7)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div
        style={{
          alignSelf: 'flex-start',
          fontFamily: font.mono,
          fontSize: 18,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: toneColor,
          background: `${toneColor}1A`,
          border: `1px solid ${toneColor}33`,
          borderRadius: 999,
          padding: '8px 12px',
        }}
      >
        {badge}
      </div>
      <div
        style={{
          fontSize: 36,
          lineHeight: 1.16,
          fontWeight: 800,
          letterSpacing: '-0.04em',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 24,
          lineHeight: 1.55,
          color: palette.muted,
        }}
      >
        {body}
      </div>
    </div>
  );
};

const CommandPill = ({
  label,
  delay = 0,
  tone = palette.accent,
}: {
  label: string;
  delay?: number;
  tone?: string;
}) => (
  <div
    className="sv-fadeUp"
    style={{
      animationDelay: `${delay}ms`,
      fontFamily: font.mono,
      fontSize: 18,
      color: tone,
      border: `1px solid ${tone}44`,
      background: `${tone}14`,
      padding: '10px 14px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

const TerminalShell = ({
  title,
  children,
  width = '100%',
  height = '100%',
  className,
}: {
  title: string;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      width,
      height,
      borderRadius: 26,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0d1219, #0a0e14)',
      border: `1px solid ${palette.borderStrong}`,
      boxShadow: '0 40px 90px -55px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.02)',
    }}
  >
    <div
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 18px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        borderBottom: `1px solid ${palette.border}`,
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#ff5f56' }} />
        <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#ffbd2e' }} />
        <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#27c93f' }} />
      </div>
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: font.mono,
          fontSize: 17,
          letterSpacing: '0.08em',
          color: palette.muted,
        }}
      >
        {title}
      </div>
      <div style={{ width: 70 }} />
    </div>
    <div style={{ position: 'relative', height: 'calc(100% - 52px)' }}>{children}</div>
  </div>
);

const TypingTerminal = ({
  lines,
  speed = 18,
  startDelay = 180,
  className,
  textStyle,
}: {
  lines: string[];
  speed?: number;
  startDelay?: number;
  className?: string;
  textStyle?: React.CSSProperties;
}) => {
  const script = lines.join('\n');
  const [text, setText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current?.closest('[data-osd-freeze-motion]') || isStaticPreviewMode()) {
      setText(script);
      return;
    }

    let alive = true;
    let timer = 0;
    setText('');

    const tick = (index: number) => {
      if (!alive) return;
      if (index > script.length) return;
      setText(script.slice(0, index));
      timer = window.setTimeout(() => tick(index + 1), speed);
    };

    timer = window.setTimeout(() => tick(0), startDelay);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [script, speed, startDelay]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        fontFamily: font.mono,
        fontSize: 24,
        lineHeight: 1.65,
        color: palette.text,
        whiteSpace: 'pre-wrap',
        ...textStyle,
      }}
    >
      {text}
      <span className="sv-caret" style={{ color: palette.accent }} />
    </div>
  );
};

const PageOne: Page = () => (
  <div style={fill}>
    <Styles />
    <GridBg />
    <Blobs />

    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '120px 120px 110px',
        display: 'grid',
        gridTemplateColumns: '1.08fr 0.92fr',
        gap: 60,
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: 840 }}>
        <div
          className="sv-fadeUp"
          style={{
            fontFamily: font.mono,
            fontSize: 22,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: palette.muted,
            marginBottom: 22,
          }}
        >
          SlideV Shell Workflow
        </div>
        <h1
          className="sv-fadeUp"
          style={{ fontFamily: font.display, fontSize: '141px', fontWeight: '500', lineHeight: 0.96, letterSpacing: '-0.05em', margin: 0 }}
        >
          스크립트 하나로
          <br />
          슬라이드 만들기
        </h1>
        <p
          className="sv-fadeUp"
          style={{
            margin: '34px 0 0',
            maxWidth: 760,
            fontSize: 34,
            lineHeight: 1.55,
            color: palette.muted,
          }}
        >
          `slides/slidev.sh`가 개발, 빌드, export, publish, serve, ship를 한 흐름으로 묶어 줍니다.
        </p>

        <div
          className="sv-fadeUp"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 34,
          }}
        >
          <CommandPill label="자동 덱 선택" delay={120} tone={palette.accent} />
          <CommandPill label="로컬 바이너리 우선" delay={220} tone={palette.accent2} />
          <CommandPill label="안전한 실패 처리" delay={320} tone={palette.accent3} />
          <CommandPill label="Git ship" delay={420} tone={palette.accent4} />
        </div>
      </div>

      <div className="sv-fadeUp" style={{ animationDelay: '220ms', height: 620 }}>
        <TerminalShell title="slides/slidev.sh demo" height={620}>
          <div style={{ padding: '26px 28px 30px', position: 'relative', height: '100%' }}>
            <div className="sv-scan" />
            <TypingTerminal
              lines={[
                '$ slides/slidev.sh list',
                '[slidev] 1 deck found: pr_slidev.md',
                '$ slides/slidev.sh dev',
                '[slidev] local binary: node_modules/.bin/slidev',
                '[slidev] ready at http://localhost:3032',
              ]}
              speed={20}
              startDelay={260}
              textStyle={{ color: palette.textSoft, maxWidth: 560 }}
            />

            <div
              style={{
                position: 'absolute',
                right: 22,
                bottom: 22,
                display: 'flex',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: font.mono,
                  fontSize: 16,
                  color: palette.accent,
                  border: `1px solid ${palette.accent}40`,
                  background: `${palette.accent}14`,
                  padding: '8px 12px',
                  borderRadius: 999,
                }}
              >
                live reload
              </span>
              <span
                style={{
                  fontFamily: font.mono,
                  fontSize: 16,
                  color: palette.accent2,
                  border: `1px solid ${palette.accent2}40`,
                  background: `${palette.accent2}14`,
                  padding: '8px 12px',
                  borderRadius: 999,
                }}
              >
                logs
              </span>
            </div>
          </div>
        </TerminalShell>
      </div>
    </div>

    <Footer />
  </div>
);

const PageTwo: Page = () => (
  <div style={fill}>
    <Styles />
    <GridBg />
    <Blobs />
    <div style={{ position: 'absolute', inset: 0, padding: '110px 120px 110px', display: 'flex', flexDirection: 'column' }}>
      <SectionTitle
        kicker="핵심 포인트"
        title="무엇을 자동화하나"
        subtitle="이 스크립트의 핵심은 복잡함을 감추는 것입니다. 기억해야 할 건 명령이 아니라 흐름입니다."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginTop: 44, flex: 1 }}>
        <Card
          badge="auto select"
          title="덱을 자동으로 고른다"
          body="`slides/` 안의 `.md`가 하나면 바로 사용합니다. 여러 개면 목록을 보여주고 선택을 요구합니다."
          delay={0}
          tone="accent"
        />
        <Card
          badge="local first"
          title="로컬 바이너리를 먼저 쓴다"
          body="`node_modules/.bin/slidev`가 있으면 우선 사용하고, 없을 때만 `npm exec --yes slidev`로 넘어갑니다."
          delay={130}
          tone="green"
        />
        <Card
          badge="safe ship"
          title="실패는 빨리, 로그는 친절하게"
          body="`set -euo pipefail`로 문제를 조기 발견하고, 모든 메시지는 `[slidev]` 프리픽스로 읽기 쉽게 남깁니다."
          delay={260}
          tone="amber"
        />
      </div>

      <div
        className="sv-fadeUp"
        style={{
          animationDelay: '380ms',
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border: `1px solid ${palette.border}`,
          borderRadius: 20,
          padding: '18px 22px',
        }}
      >
        <div style={{ fontSize: 24, lineHeight: 1.5, color: palette.textSoft }}>
          발표자는 덱 이름과 명령만 기억하면 됩니다. 나머지는 스크립트가 알아서 정리합니다.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <CommandPill label="list" tone={palette.accent} />
          <CommandPill label="dev" tone={palette.accent2} />
          <CommandPill label="build" tone={palette.accent3} />
          <CommandPill label="ship" tone={palette.accent4} />
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

const PageThree: Page = () => (
  <div style={fill}>
    <Styles />
    <GridBg />
    <Blobs />

    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '110px 120px 110px',
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: 34,
        alignItems: 'start',
      }}
    >
      <div>
        <SectionTitle
          kicker="자동 선택 규칙"
          title="덱이 하나면 바로, 여러 개면 목록"
          subtitle="슬라이드 파일이 하나뿐일 때는 손대지 않고 바로 실행합니다. 복수일 때만 사용자가 선택하도록 넘깁니다."
        />

        <div style={{ marginTop: 42, position: 'relative', paddingLeft: 10 }}>
          <div
            className="sv-lineGrow"
            style={{
              position: 'absolute',
              left: 154,
              top: 84,
              width: 196,
              height: 2,
              background: palette.borderStrong,
              animationDelay: '90ms',
            }}
          />
          <div
            className="sv-lineGrow"
            style={{
              position: 'absolute',
              left: 350,
              top: 84,
              width: 150,
              height: 2,
              background: palette.borderStrong,
              animationDelay: '240ms',
            }}
          />
          <div style={{ display: 'grid', gap: 18 }}>
            <div
              className="sv-fadeUp"
              style={{
                animationDelay: '90ms',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 132,
                  height: 92,
                  borderRadius: 18,
                  background: 'linear-gradient(180deg, rgba(136,215,255,0.18), rgba(136,215,255,0.08))',
                  border: `1px solid ${palette.accent}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: font.mono,
                  color: palette.accent,
                  fontSize: 20,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                scan
              </div>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 19, color: palette.muted, marginBottom: 8 }}>
                  `slides/` 스캔
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.25 }}>사용 가능한 `.md`를 찾는다</div>
              </div>
            </div>
            <div
              className="sv-fadeUp"
              style={{
                animationDelay: '190ms',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 132,
                  height: 92,
                  borderRadius: 18,
                  background: 'linear-gradient(180deg, rgba(126,224,166,0.18), rgba(126,224,166,0.08))',
                  border: `1px solid ${palette.accent2}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: font.mono,
                  color: palette.accent2,
                  fontSize: 20,
                }}
              >
                one
              </div>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 19, color: palette.muted, marginBottom: 8 }}>
                  파일이 1개
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.25 }}>바로 그 덱을 실행한다</div>
              </div>
            </div>
            <div
              className="sv-fadeUp"
              style={{
                animationDelay: '290ms',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 132,
                  height: 92,
                  borderRadius: 18,
                  background: 'linear-gradient(180deg, rgba(247,198,110,0.18), rgba(247,198,110,0.08))',
                  border: `1px solid ${palette.accent3}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: font.mono,
                  color: palette.accent3,
                  fontSize: 20,
                }}
              >
                many
              </div>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 19, color: palette.muted, marginBottom: 8 }}>
                  파일이 여러 개
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.25 }}>목록을 보여주고 고르게 한다</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TerminalShell title="auto-select preview" height={620}>
        <div style={{ position: 'relative', height: '100%', padding: '28px 28px 26px' }}>
          <div className="sv-scan" />
          <TypingTerminal
            lines={[
              '$ slides/slidev.sh list',
              'pr_slidev.md',
              '',
              '$ slides/slidev.sh dev',
              '[slidev] 1 deck found',
              '[slidev] using pr_slidev.md',
            ]}
            speed={24}
            startDelay={220}
            textStyle={{ color: palette.textSoft }}
          />

          <div
            style={{
              position: 'absolute',
              left: 28,
              right: 28,
              bottom: 24,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
            }}
          >
            <div
              style={{
                padding: 16,
                borderRadius: 18,
                background: 'rgba(136,215,255,0.08)',
                border: `1px solid ${palette.accent}22`,
                color: palette.accent,
                fontFamily: font.mono,
                fontSize: 16,
              }}
            >
              1개면 무조건 자동
            </div>
            <div
              style={{
                padding: 16,
                borderRadius: 18,
                background: 'rgba(126,224,166,0.08)',
                border: `1px solid ${palette.accent2}22`,
                color: palette.accent2,
                fontFamily: font.mono,
                fontSize: 16,
              }}
            >
              여러 개면 선택 목록
            </div>
          </div>
        </div>
      </TerminalShell>
    </div>

    <Footer />
  </div>
);

const PageFour: Page = () => (
  <div style={fill}>
    <Styles />
    <GridBg />
    <Blobs />

    <div style={{ position: 'absolute', inset: 0, padding: '110px 120px 110px', display: 'flex', flexDirection: 'column' }}>
      <SectionTitle
        kicker="개발 · 출력"
        title="자주 쓰는 명령은 네 개면 충분하다"
        subtitle="개발과 산출 단계는 `list`, `dev`, `build`, `export`로 대부분 끝납니다."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28, marginTop: 44, flex: 1 }}>
        <Card
          badge="list"
          title="덱 목록 보기"
          body="사용 가능한 슬라이드를 탐색합니다. 자동 선택이 어려운 경우, 이 명령의 출력이 선택 기준이 됩니다."
          delay={0}
          tone="accent"
        />
        <Card
          badge="dev"
          title="개발 서버 시작"
          body="`slidev` dev 모드로 로컬 편집을 바로 시작합니다. 실제 작업의 시작점이 됩니다."
          delay={120}
          tone="green"
        />
        <Card
          badge="build"
          title="정적 사이트로 빌드"
          body="`--out`와 `--base`를 조합해 배포 경로를 맞춥니다. 필요하면 `--download`로 에셋 처리도 더합니다."
          delay={240}
          tone="amber"
        />
        <Card
          badge="export"
          title="PDF / PPTX / PNG로 내보내기"
          body="`--format`과 `--with-clicks`를 함께 쓰면 발표용 산출물을 안정적으로 만들 수 있습니다."
          delay={360}
          tone="violet"
        />
      </div>
    </div>

    <Footer />
  </div>
);

const PageFive: Page = () => (
  <div style={fill}>
    <Styles />
    <GridBg />
    <Blobs />

    <div style={{ position: 'absolute', inset: 0, padding: '110px 120px 110px', display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 34, alignItems: 'start' }}>
      <div>
        <SectionTitle
          kicker="배포 · 전달"
          title="publish, serve, ship는 마무리 루틴"
          subtitle="발표를 공유하는 과정은 빌드뿐 아니라 서빙과 Git 정리까지 이어집니다."
        />

        <div style={{ marginTop: 42, display: 'grid', gap: 18 }}>
          <Card
            badge="publish"
            title="모든 덱을 한 번에 빌드"
            body="`slides/` 아래의 모든 덱을 `dist/`로 모으고, 루트 `index.html`까지 복사합니다."
            delay={0}
            tone="accent"
          />
          <Card
            badge="serve"
            title="정적 파일을 로컬 서버로 확인"
            body="publish 결과를 Python HTTP 서버로 띄워 최종 산출물을 빠르게 검수합니다."
            delay={120}
            tone="green"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: 24, height: '100%' }}>
        <TerminalShell title="release checklist" height={470}>
          <div style={{ position: 'relative', height: '100%', padding: '26px 28px 28px' }}>
            <div className="sv-scan" />
            <TypingTerminal
              lines={[
                '$ slides/slidev.sh publish',
                '[slidev] build every deck in slides/',
                '$ slides/slidev.sh serve',
                '[slidev] http://localhost:3032',
                '$ slides/slidev.sh ship "Update slides"',
                '[slidev] add → commit → push',
              ]}
              speed={22}
              startDelay={220}
              textStyle={{ color: palette.textSoft }}
            />
          </div>
        </TerminalShell>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Card
            badge="ship"
            title="변경 사항을 Git에 올리기"
            body="스테이징, 커밋, 푸시를 한 번에 처리합니다. 기본 커밋 메시지는 `Update slides`입니다."
            delay={80}
            tone="amber"
          />
          <Card
            badge="help"
            title="도움말과 사용법"
            body="`-h`, `--help`, `help`는 같은 역할을 합니다. 빠르게 기억을 복구할 수 있습니다."
            delay={160}
            tone="violet"
          />
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

const PageSix: Page = () => (
  <div style={fill}>
    <Styles />
    <GridBg />
    <Blobs />

    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '120px 120px 110px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        className="sv-fadeUp"
        style={{
          fontFamily: font.mono,
          fontSize: 22,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: palette.muted,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        workflow summary
      </div>
      <h2
        className="sv-fadeUp"
        style={{
          fontFamily: font.display,
          fontSize: 92,
          lineHeight: 1.06,
          letterSpacing: '-0.045em',
          margin: 0,
          textAlign: 'center',
          fontWeight: 900,
        }}
      >
        개발에서 배포까지,
        <br />
        흐름은 하나로 정리된다
      </h2>
      <p
        className="sv-fadeUp"
        style={{
          margin: '28px auto 0',
          maxWidth: 1040,
          fontSize: 32,
          lineHeight: 1.55,
          color: palette.muted,
          textAlign: 'center',
        }}
      >
        `list → dev → build/export → publish → serve → ship` 순서만 기억하면 됩니다. 나머지는 스크립트가 정리하고, 덱은 더 일관되게 유지됩니다.
      </p>

      <div
        className="sv-fadeUp"
        style={{
          animationDelay: '180ms',
          display: 'flex',
          justifyContent: 'center',
          gap: 14,
          flexWrap: 'wrap',
          marginTop: 36,
        }}
      >
        <CommandPill label="일관된 실행" tone={palette.accent} />
        <CommandPill label="짧은 명령" tone={palette.accent2} />
        <CommandPill label="안정적인 산출물" tone={palette.accent3} />
      </div>

      <div
        className="sv-fadeUp"
        style={{
          animationDelay: '300ms',
          margin: '54px auto 0',
          width: 980,
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border: `1px solid ${palette.border}`,
          borderRadius: 22,
          padding: '20px 22px',
        }}
      >
        <div style={{ fontSize: 24, lineHeight: 1.5, color: palette.textSoft }}>
          발표자료 운영의 목표는 명령을 늘리는 것이 아니라, 반복을 줄이는 것입니다.
        </div>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 18,
            color: palette.accent,
            border: `1px solid ${palette.accent}33`,
            background: `${palette.accent}12`,
            padding: '10px 14px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
          }}
        >
          `slides/slidev.sh ship`
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

export const meta: SlideMeta = {
  title: 'SlideV 실행 스크립트',
  createdAt: '2026-05-24T08:37:27.693Z',
};

export default [PageOne, PageTwo, PageThree, PageFour, PageFive, PageSix] satisfies Page[];
