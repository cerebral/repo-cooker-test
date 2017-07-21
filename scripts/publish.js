import { cooker } from './cooker'
import * as cook from 'repo-cooker/actions'

cooker.run('publish', [
  cook.getLatestReleaseHash,
  cook.getHistoryFromHash,
  cook.getRawCommitsFromHistory,
  cook.parseCommits,
  cook.groupCommitsByPackage,
  cook.evaluateSemverByPackage,
  cook.relatedPackagesByPackage,
  cook.getCurrentVersionByPackage,
  cook.evaluateNewVersionByPackage,
  cook.writeVersionsToPackages,
  cook.publishUnderTemporaryNpmTag,
  cook.mapTemporaryNpmTagToLatest,
  cook.resetRepository,
  cook.tagCurrentCommit,
  cook.pushTagToRemote,
  cook.createReleaseNotes(release => `some release notes`),
  cook.createGithubRelease,
  cook.fireworks,
])
