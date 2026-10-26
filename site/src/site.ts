// One place for names that may change (the brief: "Scenarios" may be renamed again).
export const T = {
  scenario: 'Scenario', scenarios: 'Scenarios',
  skill: 'Skill', skills: 'Skills',
  rule: 'Rule', rules: 'Rules',
  authors: 'Authors',
};

// Areas group rules and skills (Skills hub filter, rule groups). Scenario categories reuse them until DemandSense names use cases.
export const AREAS = {
  'reach-frequency': 'Reach and frequency',
  'budget-reach': 'Who the budget reaches',
  'building-account': 'Building the account',
  'signal-to-sales': 'From signal to sales',
  'ads-creative': 'Ads and creative',
} as const;
export type Area = keyof typeof AREAS;

// Two levels of navigation: the site header (every page) and the library tab bar (Directory and the three hubs only)
export const SITE_NAV = [
  { href: '/directory', label: 'Directory', match: ['/directory', '/scenarios', '/skills', '/rules'], badge: 'New' }, // badge hardcoded for now
  { href: '/authors', label: T.authors, match: ['/authors'] },
];
export const LIB_NAV = [
  { href: '/directory', label: 'Directory' },
  { href: '/scenarios', label: T.scenarios },
  { href: '/skills', label: T.skills },
  { href: '/rules', label: T.rules },
];

export const CONTRIBUTE_URL = '/contribute';
export const REPO_URL = 'https://github.com/demandsense/the-ai-standard';

// Placeholder skill icons per area until the batch of skill icons lands (brief: illustrations come last)
// Skill card cover per area: a --pastel-N token (DESIGN §4.1)
export const AREA_COVER: Record<Area, number> = {
  'reach-frequency': 13,
  'budget-reach': 17,
  'building-account': 6,
  'signal-to-sales': 9,
  'ads-creative': 1,
};

export const AREA_ICON: Record<Area, string> = {
  'reach-frequency': 'reach',
  'budget-reach': 'audience',
  'building-account': 'steps',
  'signal-to-sales': 'pair',
  'ads-creative': 'page',
};
