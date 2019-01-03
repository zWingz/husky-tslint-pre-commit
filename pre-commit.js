#!/bin/node
const { Linter, Configuration } = require('tslint')
const chalk = require('chalk')
const { log } = console
const run = require('child_process').execSync;
// const result = run('git diff', {encoding: 'utf8'})
const diffFiles = run('git diff --cached --name-only --diff-filter=ACM', {
  encoding: 'utf8'
}).toString().split('\n').filter(each => each && /tsx{0,1}$/.test(each))
const cwd = process.cwd()
if(!diffFiles.length) {
  log(chalk.bgGreen('\n\t COMMIT SUCCEEDED \n'))
  return
}
log(chalk.bgRed('\n Validating Typescript...'))
log('\n')
const configurationFilename = "tslint.json";
const options = {
    fix: false,
    formatter: "codeFrame"
};

const program = Linter.createProgram("tsconfig.json");
const linter = new Linter(options, program);

diffFiles.forEach(file => {
    const fileContents = program.getSourceFile(file).getFullText();
    const configuration = Configuration.findConfiguration(configurationFilename, file).results;
    linter.lint(file, fileContents, configuration);
});

const { output, errorCount, warningCount } = linter.getResult();
// results.
let pass = 0
const error = chalk.bold.red;
const success = chalk.green
if(errorCount !== 0) {
  log(output);
  log(error('\t Tslint Failed, Please fix it! \n'))
  pass = 1
} else if(warningCount !== 0) {
  const warning = chalk.keyword('orange');
  log(warning('\t There are some warning! '));
} else {
  log(success('\tTypescript validation completed! \n'))
}
if(!pass) {
  log(chalk.bgGreen('\t COMMIT SUCCEEDED \n'))
} else {
  log(error('\t COMMIT FAILED \n'))
}
process.exit(pass)
