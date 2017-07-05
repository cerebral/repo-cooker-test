import { Cooker } from 'repo-cooker'
import path from 'path'

export const cooker = Cooker({
  git: {
    path: path.resolve(path.join(__dirname, '..')),
  },
})
