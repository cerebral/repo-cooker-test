import Devtools from 'function-tree/devtools'
import { Cooker } from 'repo-cooker'
import path from 'path'

function functionName(fun) {
  var ret = fun.toString()
  ret = ret.substr('function '.length)
  ret = ret.substr(0, ret.indexOf('('))
  return ret
}

export const cooker = Cooker({
  devtools: new Devtools({
    host: 'localhost:8787',
  }),
  path: '.',
  packagesGlobs: [
    'packages/*',
    'packages/node_modules/*',
    'packages/node_modules/@repo-cooker-test/*',
    '!packages/node_modules',
    '!packages/node_modules/@repo-cooker-test',
  ],
  dryRun(cmd, args, options) {
    console.log('CMD - ', typeof cmd === 'function' ? functionName(cmd) : cmd)
    console.log('ARGS - ', JSON.stringify(args, null, 2))
    console.log('OPTIONS - ', options || 'N/A')
    console.log('======================================')
    return Promise.resolve()
  },
})
