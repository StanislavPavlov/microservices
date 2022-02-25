const branch = process.env.GIT_BRANCH;

/**
 * This is root config for microservices
 * All microservices extends from this
 */
module.exports = {
  branches: [
    'prod',
    {
      name: 'staging',
      prerelease: true,
    },
  ],
  extends: 'semantic-release-monorepo',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', {
      npmPublish: branch === 'prod',
    }],
    // only in production
    ...(branch === 'prod' ? [
      '@semantic-release/github',
    ] : []),
  ]
}
