const exec = require('child_process').exec;
const decamelize = require('decamelize');

/**
 * run several 'npm install' commands,
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
            exec(`npm install ${module} ${opts}`, error => {
                if (error) {
                    console.log(`${module} unsuccesfully installed`);
                    console.error(error);
                } else {
                    console.log(`${module} succesfully installed`);
                }
            });
        });
    } else {
        console.log('Nothing to install');
    }
}

const installer = {install};

export {installer};
