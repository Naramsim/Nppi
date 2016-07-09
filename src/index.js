import {parser} from './parser';
import {installer} from './installer';

/**
 * Export needed by 'cli.js'
 * It starts the entire process
 *
 * @param {Object} flags
 * @param {Array} toParse
 */
exports.start = function (flag, toParse) {
    if (toParse) {
        installer.install(flag, parser.parse(flag, toParse));
    }
};
