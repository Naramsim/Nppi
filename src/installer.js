const execSync = require('child_process').execSync;
const decamelize = require('decamelize');

/**
 * runs several 'npm install' commands,
 * one for each module with the flags passed
 *
 * @param {Object} flags
 * @param {Array} modules
 */
function install(flags, modules) {
    if (modules && modules.size > 0) {
        console.log(`The following packages will be installed: ${[...modules].join(', ')}`);
        const opts = Object.keys(flags)
            .map(flag => {
                return `--${decamelize(flag, '-')}`;
            })
            .join(' ');

        modules.forEach(module => {
            execSync(`npm install ${module} ${opts}`, {encoding: 'utf8', stdio: [0, 1, 2]});
        });
    } else {
        console.log('Nothing to install');
    }
}

const installer = {install};

export {installer};
