const pkgDir = require('pkg-dir')
const path = require('path')
const fs = require('fs')
const [, dir] = process.argv
const pkgRoot = pkgDir.sync(path.join(dir, '../..'))
const pkgPath = path.join(pkgRoot, 'package.json')
const packageJson = require(pkgPath)
const precommitPath = path.relative(pkgRoot, path.join(dir, '../pre-commit.js'));
packageJson.husky = {
  hooks: {
    'pre-commit': `node ${precommitPath}`
  }
}
fs.writeFileSync(pkgPath, JSON.stringify(packageJson, null, 2) + '\n')
