// import {sequence, parallel} from 'function-tree'
// import {} from 'repo-cooker'

// tree to run with `repo-cooker publish`. extra arguments could be parsed and putted in props
import { cooker } from './cooker'
import * as cook from 'repo-cooker/actions'

const typeToSemver = { feat: 'minor', fix: 'patch' }
const evaluateSemver = commit =>
  commit.breaks.length ? 'major' : typeToSemver[commit.type]

const evaluatePackagesFromCommit = commit =>
  // TODO: parse file path and detect package
  commit.files.map(file => 'foobar')

cooker.run('publish', [
  cook.getLatestReleaseHash,
  // { hash: "e654cd..." }

  // Get list of commit hashes from `props.hash` to master. If `props.hash` is 'Big Bang', returns
  // the full history up to current master. An invalid hash returns an empty list.
  cook.getHistoryFromHash,
  // { history: ["c456e...", "4d76f..."] }

  // Resolve history list of hash to raw commits.
  cook.getRawCommitsFromHistory,
  // { rawCommits: [{hash, author:{name,email}, message, files}] }
  cook.parseCommits,
  // { commits: [{hash, author, ..., type, scope, summary, issues, breaks, body}]}

  // A factory that takes a mapping function from a commit to
  // a list of package names.
  cook.groupCommitsByPackage(evaluatePackagesFromCommit),
  // {commitsByPackage: [
  //   {name: 'firebase', commits: [{hash: "2424", ...}]},
  //   {name: 'http', commits: [{hash: "2424", ...}]},
  // ]}

  cook.evaluateSemverByPackage(evaluateSemver),
  // Based on parsed commit figure out type of release
  // repo-cooker will automatically use the highest in
  // 'major' > 'minor' > 'patch' > 'noop'
  // {semverByPackage: [
  //   {name: 'firebase', type: 'major'},
  //   {name: 'http', type: 'minor'},
  // ]}

  cook.getCurrentVersionByPackage,
  // Go to NPM and grab current version of packages
  // {currentVersionByPackage: [
  //   {name: 'firebase', version: '1.6.0'},
  //   {name: 'http', version: '1.6.4'},
  // ]}

  cook.evaluateNewVersionByPackage,
  // Based on type of change, use semver bumping
  // {newVersionByPackage: [
  //   {name: 'firebase', version: '1.6.1'},
  //   {name: 'http', version: '1.7.0'},
  // ]}

  cook.writeVersionToPackages,
  // Just write the new version to package.json of packages
  // this is temporary for release and does not need to be pushed to repo

  cook.publishUnderTemporaryNpmTag,
  // Need to ensure successful release of all packages, so
  // we publish under a temporary tag first
  // {temporaryNpmTagByPackage: [
  //   {name: 'firebase', tag: 'releasing'},
  //   {name: 'http', tag: 'releasing'},
  // }

  cook.mapTemporaryNpmTagToLatest,
  // If successful we just map published tags to official release tag

  cook.resetRepository,
  // Version information is not stored in package.json so we
  // cleanup repo now.

  cook.tagCurrentCommit,
  // Tag current commit with the name format:
  // { tag: {
  //     name: 'release_2018-08-20_0800',
  //     date: '2017-07-09T19:06:31.620Z', // ISO string
  //   }
  // }

  cook.pushTagToRemote,
  // Pushes tag to remote repository

  cook.createReleaseNotes(release => ``),
  // The `release` object has this format:
  // {
  //   tag: 'release_2017-09-07_0900',
  //   date: '2017-07-09T19:06:31.620Z', // ISO string
  //   fix: [
  //     {
  //       name: 'packageName',
  //       version: 'new.package.version',
  //       commits: [], // see above for commit format
  //     },
  //     {
  //       name: 'otherPackage',
  //       version: 'new.other.version',
  //       commits: [], // see above for commit format
  //     },
  //   ],
  //   feat: [
  //     // same as 'fix'
  //   ],
  //   breaks: [
  //     // same as 'fix'
  //   ],
  // }
  //
  // The action outputs this:
  // { releaseNotes: "Woop woop" }

  cook.createGithubRelease,
  // Send release notes to github on release tag, using name format:
  // Release 2018-08-20 08:00
  // { githubRelease } // See https://developer.github.com/v3/repos/releases/#create-a-release

  // buildWebsite,
  // Yeah... you know

  // publishWebsite,
  // Jup

  cook.fireworks,
])
