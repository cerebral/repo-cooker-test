import { Cooker } from 'repo-cooker'

const dryRun = process.argv[2] !== '--publish'
process.env.REPO_COOKER_GITHUB_TOKEN = process.env.GH_TOKEN

export const cooker = Cooker({
  devtools: null,
  path: '.',
  packagesGlobs: [
    'packages/node_modules/*',
    'packages/node_modules/@repo-cooker-test/*',
    '!packages/node_modules/@repo-cooker-test',
  ],
  dryRun,
})
