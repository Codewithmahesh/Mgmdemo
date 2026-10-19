// Everything you may want to edit before the day lives here.

/** The name of the whole package, shown on the last face of the cube and on the final screen. */
export const PACKAGE_NAME = 'Praxis';
export const COMPANY_NAME = 'Exponentor';

/** The three things. `line` is the one short line under each name. */
export const FEATURES = [
  { no: '01', name: 'Arena', line: 'Secure online exams', icon: 'arena' },
  { no: '02', name: 'Studio', line: '40+ compilers', icon: 'studio' },
  { no: '03', name: 'Pocket', line: 'Android and iPhone', icon: 'pocket' },
] as const;

export type FeatureIcon = (typeof FEATURES)[number]['icon'];

/** The old way of running an exam, as six cards. x / y are percentages of the stage; r is the tilt; j the shake. */
export const CARDS = [
  { kind: 'qp', tag: 'Typed papers', x: 22, y: 38, r: -6, j: 5 },
  { kind: 'same', tag: 'Same paper for all', x: 50, y: 35, r: 4, j: 6 },
  { kind: 'code', tag: 'Code & journals on paper', x: 78, y: 39, r: -3, j: 4 },
  { kind: 'ans', tag: 'Answer sheets', x: 30, y: 64, r: 5, j: 7 },
  { kind: 'xl', tag: 'Marks in Excel', x: 56, y: 66, r: -7, j: 5 },
  { kind: 'clock', tag: 'Time by the clock', x: 77, y: 62, r: 3, j: 8 },
] as const;

export type CardKind = (typeof CARDS)[number]['kind'];

/** 1 = default speed. Use 1.3 for slower, 0.8 for faster. */
export const PACE = 1;
