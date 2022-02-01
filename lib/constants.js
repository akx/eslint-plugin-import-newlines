const SPECIFIERS = {
  IMPORT: 'ImportSpecifier',
  DEFAULT_IMPORT: 'ImportDefaultSpecifier',
};

const DEFAULTS = {
  ITEMS: 4,
  MAX_LENGTH: Infinity,
  SEMI: true,
  COMMENTS: 'strip',
};

const MESSAGES = {
  MUST_SPLIT_MANY: 'mustSplitMany',
  MUST_SPLIT_LONG: 'mustSplitLong',
  MUST_NOT_SPLIT: 'mustNotSplit',
  NO_BLANK_BETWEEN: 'noBlankBetween',
  LIMIT_LINE_COUNT: 'limitLineCount',
  NO_COMMENTS: 'noComments',
};

module.exports = {
  SPECIFIERS,
  DEFAULTS,
  MESSAGES,
};
