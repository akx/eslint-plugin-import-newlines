/* eslint-env mocha */
const { RuleTester } = require('eslint');
const rule = require('../lib/enforce');

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

const repeatString = (str, times) => [...new Array(times + 1)].join(str);

ruleTester.run('enforce', rule, {
  valid: [
    {
      code: "import type { a, b, c, d } from './test'",
    },
    {
      code: "import type { a, b, c, d } from './test'",
      options: [6],
    },
    {
      code: "import type { a, b, c, d } from './test'",
      options: [{
        items: 6,
      }],
    },
    {
      code: "import type {\na,\nb,\nc\n} from './test'",
      options: [2],
    },
    {
      code: "import type {\na,\nb,\nc\n} from './test'",
      options: [{
        items: 2,
      }],
    },
    {
      code: "import type { default as test, a } from './test'",
    },
    {
      code: "import type { a, b, c, d } from './test'",
      options: [4, 50],
    },
    {
      code: "import type { a, b, c, d } from './test'",
      options: [{
        items: 4,
        'max-len': 50,
      }],
    },
    {
      code: `import type { ${repeatString('a', 20)} } from './test'`,
      options: [1, 50],
    },
    {
      code: `import type { ${repeatString('a', 20)} } from './test'`,
      options: [{
        items: 1,
        'max-len': 50,
      }],
    },
    {
      code: `import type {\n${repeatString('a', 25)},\n${repeatString('b', 25)}\n} from './test'`,
      options: [6, 50],
    },
    {
      code: `import type {\n${repeatString('a', 25)},\n${repeatString('b', 25)}\n} from './test'`,
      options: [{
        items: 6,
        'max-len': 50,
      }],
    },
    {
      code: "import type { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t } from './test'",
      options: [20, 88],
    },
    {
      code: "import type { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t } from './test'",
      options: [{
        items: 20,
        'max-len': 88,
      }],
    },
    {
      code: "import type { default as test, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s } from './test'",
      options: [20, 102],
    },
    {
      code: "import type { default as test, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s } from './test'",
      options: [{
        items: 20,
        'max-len': 102,
      }],
    },
    {
      code: `import type { ${repeatString('a', 512)} } from './test'`,
      options: [1],
    },
    {
      code: `import type { ${repeatString('a', 512)} } from './test'`,
      options: [{
        items: 1,
      }],
    },
    {
      code: `import type {\n    aaaaaaaaaaa,\n    aaaaaaaaaaaaaaaaaaa,\n    aaaaaaaaaaaaa\n} from './${repeatString('a', 72)}';`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
    },
    {
      code: `import type { ${repeatString('a', 46)} } from './${repeatString('a', 67)}';`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
    },
    {
      code: `import type { default as ${repeatString('a', 30)}, aaa } from './${repeatString('a', 67)}';`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
    },
    {
      code: "import {\n\tsomeValue\n\t// @ts-ignore\n} from './module';",
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
        preserveComments: true,
      }],
    },
  ],

  invalid: [
    {
      code: "import type {\na,\nb\n} from './test'",
      output: "import type { a, b } from './test'",
      options: [4],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: "import type {\ndefault as test,\na as apple,\nb as banana\n} from './test'",
      output: "import type { default as test, a as apple, b as banana } from './test'",
      options: [3],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: "import type {\ndefault as test,\na,\nb\n} from './test'",
      output: "import type { default as test, a, b } from './test'",
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: "import type {\ndefault as test,\na,\nb\n} from './test'",
      output: "import type { default as test, a, b } from './test';",
      options: [{
        semi: true,
      }],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: "import type { a, b, c, d } from './test'",
      output: "import type {\na,\nb,\nc,\nd\n} from './test'",
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: "import type { a, b, c, d } from './test'",
      output: "import type {\na,\nb,\nc,\nd\n} from './test';",
      options: [{
        items: 1,
        semi: true,
      }],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: "import type { default as test, a, b } from './test'",
      output: "import type {\ndefault as test,\na,\nb\n} from './test'",
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: "import test, { a, b as banana } from './test'",
      output: "import test, {\na,\nb as banana\n} from './test'",
      options: [1],
      errors: [{ messageId: 'mustSplitMany' }],
    },
    {
      code: "import type { \na,\n\nb,\n\n\nc,\n\n\nd,\n\n\n\ne\n} from './test'",
      output: "import type {\na,\nb,\nc,\nd,\ne\n} from './test'",
      options: [4],
      errors: [{ messageId: 'noBlankBetween' }],
    },
    {
      code: "import type { a,\n\n\nb } from './test'",
      output: "import type {\na,\nb\n} from './test'",
      options: [1],
      errors: [{ messageId: 'noBlankBetween' }],
    },
    {
      code: "import type {\n\na,\nb\n\n\n} from './test'",
      output: "import type {\na,\nb\n} from './test'",
      options: [1],
      errors: [{ messageId: 'limitLineCount' }],
    },
    {
      code: "import type {\na, b, c\n} from './test'",
      output: "import type {\na,\nb,\nc\n} from './test'",
      options: [1],
      errors: [{ messageId: 'limitLineCount' }],
    },
    {
      code: "import type { getPublicStaticVoidFinalObjectExtensionFactory } from './test'",
      output: "import type {\ngetPublicStaticVoidFinalObjectExtensionFactory\n} from './test'",
      options: [4, 50],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: "import type { aaaaaaaaa, bbbbbbbbb, ccccccccc, dddddddd } from './test'",
      output: "import type {\naaaaaaaaa,\nbbbbbbbbb,\nccccccccc,\ndddddddd\n} from './test'",
      options: [4, 50],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: `import {\n    aaaaaaaaaaa,\n    aaaaaaaaaaaaaaaaaaa,\n    aaaaaaaaaaaaa\n} from './${repeatString('a', 72)}';`,
      output: `import { aaaaaaaaaaa, aaaaaaaaaaaaaaaaaaa, aaaaaaaaaaaaa } from './${repeatString('a', 72)}'`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: false,
      }],
      errors: [{ messageId: 'mustNotSplit' }],
    },
    {
      code: `import { aaaaaaaaaaa, aaaaaaaaaaaaaaaaaaa, aaaaaaaaaaaaa } from './${repeatString('a', 73)}';`,
      output: `import {\naaaaaaaaaaa,\naaaaaaaaaaaaaaaaaaa,\naaaaaaaaaaaaa\n} from './${repeatString('a', 73)}';`,
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
      }],
      errors: [{ messageId: 'mustSplitLong' }],
    },
    {
      code: "import {\n\tsomeValue\n\t// @ts-ignore\n} from './module';",
      output: "import {\n\tsomeValue\n} from './module';",
      options: [{
        items: 4,
        'max-len': 140,
        semi: true,
        comments: 'strip',
      }],
      errors: [{ messageId: 'noComments' }],
    },
  ],
});
