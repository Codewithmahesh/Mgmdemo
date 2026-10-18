import type { CSSProperties } from 'react';
import { CARDS, type CardKind } from '@/lib/content';

/* The old way of running an exam, drawn as six paper cards. */

function QuestionPaper() {
  return (
    <>
      <div className="qp-bar">Mid-Sem_QP_final_v3.docx</div>
      <div className="qp-page">
        <h4>Data Structures · Mid-Sem</h4>
        <p className="qp-q">Q1. Define a stack. [2]</p>
        <p className="qp-q">Q2. Output of the code below? (a) 3 (b) 4 (c) 5 (d) 6</p>
        <p className="qp-q"><s>Q3. Convert A+B*C to postfix. [3]</s></p>
        <p className="qp-q"><mark>Q4. add before printing!!</mark></p>
        <p className="qp-q">Q5. Explain queue overflow. [5]</p>
      </div>
    </>
  );
}

function SamePaper() {
  return (
    <>
      <div className="k">QUESTION PAPER</div>
      <div className="set">SET A</div>
      <div className="all">for every row</div>
      <div className="seats">
        {[1, 2, 3, 4].map((n) => (
          <span key={n}>Row {n}<b>A</b></span>
        ))}
      </div>
      <div className="sticky">Everyone is writing the same paper.</div>
    </>
  );
}

function CodeOnPaper() {
  return (
    <>
      <div className="hd">Q3. Sum of 5 numbers (C)</div>
      <pre>
        {'#include <stdio.h>\nint main() {\n  int a[5], sum = 0;\n  for (i=0; i<5; i++)\n     '}
        <span className="bad">sum += a[i]</span>
        {'\n  printf("%d", sum);\n}'}
      </pre>
      <div className="note">Did it compile?</div>
    </>
  );
}

const LINES = [88, 94, 70, 90, 58, 92, 84, 66, 90];

function AnswerSheet() {
  return (
    <>
      <div className="ans-top"><b>ANSWER BOOK</b><span>Roll No. ____</span></div>
      {LINES.map((w, i) => (
        <i key={i} className="ln" style={{ width: `${w}%` }} />
      ))}
      <span className="rm" style={{ top: '30cqw' }}>✓</span>
      <span className="rm" style={{ top: '66cqw' }}>✗</span>
      <span className="rm" style={{ top: '92cqw' }}>✓</span>
      <div className="tot">7/10</div>
    </>
  );
}

const ROWS = [
  ['Patil A.', '14', '5', '19', '2'],
  ['Kulkarni S.', '12', '#REF!', '#REF!', '#REF!'],
  ['Shaikh R.', '15', '4', '19', '2'],
  ['Deshmukh P.', '16', '###', '###', '###'],
  ['Jadhav M.', '11', '6', '17', '4'],
  ['Pawar K.', '#N/A', '5', '#N/A', '#N/A'],
  ['Joshi V.', '13', '3', '16', '5'],
  ['Rathod N.', '15', '5', '20', '1'],
];

function Spreadsheet() {
  return (
    <>
      <div className="xl-tab">marks_FINAL_v7(2).xlsx</div>
      <div className="xl-grid">
        {['Name', 'MCQ', 'Code', 'Total', 'Rank'].map((h) => (
          <span key={h} className="h">{h}</span>
        ))}
        {ROWS.map((row, i) =>
          row.map((cell, k) => (
            <span key={`${i}-${k}`} className={cell.startsWith('#') ? 'err' : i === 2 && k === 3 ? 'hl' : ''}>
              {cell}
            </span>
          )),
        )}
      </div>
      <div className="xl-foot"><span>Sheet1</span><span>Copy of Sheet1</span><span>Sheet1 (old)</span></div>
    </>
  );
}

function WallClock() {
  return (
    <>
      <div className="tt">EXAM · 10:00 – 11:00</div>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="#fff" stroke="#222" strokeWidth="3" />
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1="50" y1="9" x2="50" y2={i % 3 === 0 ? 17 : 14}
            stroke="#222" strokeWidth={i % 3 === 0 ? 2.6 : 1.4}
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        <line x1="50" y1="50" x2="50" y2="28" stroke="#222" strokeWidth="3.2" strokeLinecap="round" transform="rotate(330 50 50)" />
        <line x1="50" y1="50" x2="50" y2="14" stroke="#222" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="3" fill="#c62f2a" />
      </svg>
      <div className="sticky" style={{ left: 'auto', right: '6cqw', bottom: '6cqw' }}>5 more minutes, sir?</div>
    </>
  );
}

const BODY: Record<CardKind, () => React.JSX.Element> = {
  qp: QuestionPaper,
  same: SamePaper,
  code: CodeOnPaper,
  ans: AnswerSheet,
  xl: Spreadsheet,
  clock: WallClock,
};

export default function OldCards() {
  return (
    <div className="cards" id="cards" aria-hidden="true">
      {CARDS.map((c, i) => {
        const Body = BODY[c.kind];
        const style = {
          '--x': `${c.x}%`,
          '--y': `${c.y}%`,
          '--r0': `${c.r}deg`,
          '--z': i + 2,
          '--j': c.j,
        } as CSSProperties;
        return (
          <div key={c.kind} className="card" style={style}>
            <div className={`in ${c.kind}`}><Body /></div>
            <div className="tag">{c.tag}</div>
          </div>
        );
      })}
    </div>
  );
}
