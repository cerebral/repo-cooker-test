import { Cooker } from 'repo-cooker'

export const cooker = Cooker({
  devtools: {
    host: 'localhost:8787',
  },
  path: '.',
  packagesGlobs: [
    'packages/node_modules/*',
    'packages/node_modules/@repo-cooker-test/*',
    '!packages/node_modules/@repo-cooker-test',
  ],
  dryRun: true,
})
