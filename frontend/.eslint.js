// // Vars

// /**
//  * Application specific files to be tested via ESLint
//  * (use the glob pattern)
//  */
// const filesToTest = [
//     "*.js",
//     "src/*.js",
// ];

// const eslintBinPath = `./node_modules/.bin/eslint`;
// const platformBinExtension = process.platform === 'win32' ? '.cmd' : '';

// // RUN
// function runExec(cmd, args) {
//     require('child_process').exec(
//         `${cmd}${platformBinExtension} ${args}`,
//         (err, stdout)=> {
//             if (stdout) {
//                 console.error(stdout);
//             }
//             // fail if lint error
//             if (err) {
//                 process.exit(1);// failure error code
//             }
//         });
// }

// // Behavior depends on how the module is loaded
// if (!module.parent) {
//     // RUN- if module is not required by an another one (e.g. called by node.js)
//     runExec(eslintBinPath, filesToTest.join(' '));
// } else {
//     // EXPORT- if module is required by an another one
//     module.exports = {
//         filesToTest
//     };
// }
