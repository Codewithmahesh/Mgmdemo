import { memo, type CSSProperties } from 'react';
import { COMPANY_NAME, FEATURES, PACKAGE_NAME } from '@/lib/content';
import { BrandMark, FeatureIconSvg } from './Icons';
import OldCards from './OldCards';

/* Static markup for the whole opener. The timeline in lib/opening.ts drives it by toggling classes. */

function PortalReplica({ portalUrl }: { portalUrl: string }) {
  return (
    <div className="win" id="win">
      <div className="chrome">
        <div className="lights"><i /><i /><i /></div>
        <div className="url"><span className="lock" /><span>https://<b>test.exponentor.com</b></span></div>
        <div className="ghost" />
      </div>

      {/* A copy of the portal's own landing page. */}
      <div className="ui" aria-hidden="true">
        <header className="lp-head">
          <div className="lp-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src="/mgm-emblem.png" />
            <div><b>MGM&apos;s College of Engineering</b><span>Nanded · Online Examination Portal</span></div>
          </div>
          <div className="lp-btns"><span className="lp-link">Student login</span><span className="lp-btn">Faculty login</span></div>
        </header>
        <div className="lp-body">
          <div className="lp-copy">
            <span className="mono">Online Examination Portal</span>
            <h3>Online exams that feel like a real contest.</h3>
            <p>
              The online examination portal of MGM&apos;s College of Engineering, Nanded. Faculty build timed MCQ and coding
              tests from a CSV, a PDF or plain notes; students take them in a secure, proctored, CodeChef-style exam room.
            </p>
            <div className="lp-cta"><span className="lp-btn coral">Create a faculty account &rarr;</span><span className="lp-btn ghostbtn">Activate student account</span></div>
          </div>
          <div className="lp-exam">
            <div className="ex-h">
              <span><b>Data Structures · Mid-Sem</b><span className="chip">Proctored</span></span>
              <span className="tm">00:42:17</span>
            </div>
            <div className="ex-body">
              <div className="ex-l">
                <b>P2 · Pair Sum</b>
                <p>Given an array of N integers and a target K, print the number of pairs (i, j) with i &lt; j and A[i] + A[j] = K.</p>
                <small>Sample input</small>
                <pre>{'5 6\n1 5 3 3 2'}</pre>
                <small>Sample output</small>
                <pre>2</pre>
              </div>
              <div className="ex-r">
                <div className="tabs"><span>C++ 17</span></div>
                <p><span className="k">int</span> <span className="f">main</span>() {'{'}</p>
                <p>{'    '}<span className="k">int</span> n, k; cin &gt;&gt; n &gt;&gt; k;</p>
                <p>{'    '}map&lt;<span className="k">int</span>,<span className="k">int</span>&gt; seen;</p>
                <p>{'    '}<span className="k">long long</span> ans = <span className="n">0</span>;</p>
                <p>{'    '}<span className="o">for</span> (<span className="k">int</span> i = <span className="n">0</span>; i &lt; n; i++) {'{'}</p>
                <p>{'        '}<span className="d">{'// ...'}</span></p>
                <p>{'    }'}</p>
                <p>{'}'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero" id="hero">
        <span className="pill">{PACKAGE_NAME} · Live demo</span>
        <h2>One platform.</h2>
        <div className="rule" />
        <p>Arena · Studio · Pocket</p>
        <a className="go" id="go" href={portalUrl} target="_blank" rel="noopener">Go live <span aria-hidden="true">&rarr;</span></a>
        <div className="tip">Press Enter to go live</div>
      </div>
    </div>
  );
}

function Scene({ portalUrl }: { portalUrl: string }) {
  return (
    <>
      <div className="world" id="world">
        <header className="top">
          <div className="brand"><BrandMark />Exponentor</div>
          <div className="count"><span className="num" id="num">1</span><span className="lbl" id="lbl">manual step</span></div>
        </header>

        <section className="stage" id="stage">
          <OldCards />

          <div className="scene s-title">
            <h1 className="wordmark"><i className="dot" /><span>{COMPANY_NAME}</span></h1>
            <p className="tagline">Stop doing the same work <em>by hand, every semester.</em></p>
            <p className="hint">Press <kbd>Space</kbd> for each beat.</p>
          </div>

          <div className="scene s-three" aria-hidden="true">
            <div className="tri">
              {FEATURES.map((f) => (
                <div className="ti" key={f.name}>
                  <span className="no">{f.no}</span>
                  <div className="ic"><FeatureIconSvg name={f.icon} /></div>
                  <div><h2>{f.name}</h2><p>{f.line}</p></div>
                </div>
              ))}
            </div>
            <div className="cubewrap" id="cubewrap">
              <div className="cube" id="cube">
                {FEATURES.map((f, i) => (
                  <div className="face" key={f.name} style={{ '--a': `${i * 90}deg` } as CSSProperties}>
                    <div className="ic"><FeatureIconSvg name={f.icon} /></div>
                    <h2>{f.name}</h2>
                    <p>{f.line}</p>
                  </div>
                ))}
                <div className="face mark" style={{ '--a': '270deg' } as CSSProperties}>
                  <BrandMark className="bm" stroke={1.6} />
                  <h2>{PACKAGE_NAME}</h2>
                  <p>by {COMPANY_NAME}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="caption" id="caption" aria-live="polite">
          <h2>Six manual steps for every exam.</h2>
          <p>The tools exist. The gluing is manual.</p>
        </section>
      </div>

      <div className="vignette" />
      <div className="shadow" id="shadow" />

      <PortalReplica portalUrl={portalUrl} />

      <canvas id="fx" />
      <div className="ring" id="ring" />
      <div className="flash" id="flash" />
    </>
  );
}

export default memo(Scene);
