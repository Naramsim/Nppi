import {parser} from './parser';
import {installer} from './installer';

exports.start = function (flag, toParse) {
    if (toParse) {
        installer.install(flag, parser.parse(flag, toParse));
    }
};
