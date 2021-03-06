import * as fs from 'fs';
import * as path from 'path';
import glob from 'glob';

const packages = new Set();
const quotes = '["\'`´()]';
const excludedDirs = ['node_modules', 'bower_components'];
const nativeModules = ['assert', 'child_process', 'cluster', 'http',
                        'https', 'os', 'crypto', 'dns', 'domain', 'fs',
                        'events', 'path', 'punycode', 'querystring',
                        'readline', 'repl', 'stream', 'string_decoder',
                        'tls', 'tty', 'dgram', 'url', 'util', 'v8',
                        'vm', 'zlib'];
const requireRe =
    new RegExp(`(?:require|\\sfrom)\\s?${quotes}{1,2}([\\w\\.\\-\\_]+?)${quotes}{1,2}`, 'g');

/**
 * based on given input 'toParse',
 * starts is parsing
 * flags Array is passed to other functions
 *
 * @param {Object} flags
 * @param {Array} toParse
 */
function parse(flags, toParse) {
    try {
        if (toParse.length === 0) {
            toParse = ['./*'];
        }
        const files = glob.sync(toParse[0]);
        files.forEach(file => {
            const allowed = excludedDirs.every(excludedDir => {
                return file.indexOf(excludedDir) === -1;
            });
            if (allowed) {
                parseFile(file);
            }
        });
        return packages;
    } catch (err) {
        console.log('No files/dir matches input');
        console.log(err);
    }
}

/**
 * Reads each file in the 'dir' directory,
 * invokes 'parseAndAdd()' for each of them.
 * If a 'recursive' flag is set,
 * it invokes himself with the new dir found
 *
 * @param {Object} flags
 * @param {String} dir
 */
function parseDir(flags, dir = '.') {
    try {
        if (excludedDirs.indexOf(dir) === -1) {
            const files = fs.readdirSync(dir);
            files.forEach(element => {
                const elegible = path.join(dir, element);
                if (fs.lstatSync(elegible).isDirectory()) {
                    if (flags.recursive) {
                        parseDir(flags, elegible);
                    }
                } else if (fs.lstatSync(elegible).isFile()) {
                    parseAndAdd(fs.readFileSync(elegible, 'utf8'));
                }
            });
        }
    } catch (err) {
        console.log('No directory matched');
    }
}

/**
 * Starts the parsing for a single file
 *
 * @param {String} file
 */
function parseFile(file = 'index.js') {
    try {
        const fileStat = fs.statSync(file);
        if (fileStat) {
            if (fileStat.isFile()) {
                parseAndAdd(fs.readFileSync(file, 'utf8'));
            } else {
                console.error('You have choosen a directory, choose a file instead');
            }
        }
    } catch (err) {
        console.log('No file matched');
    }
}

/**
 * Parses a string appling to it the regex 'requireRe',
 * for each match invokes 'checkAndAdd()' with a package name
 *
 * @param {String} text
 */
function parseAndAdd(text) {
    let match = requireRe.exec(text);
    if (match && match[1]) {
        checkAndAdd(match[1], packages);
        while (match) {
            match = requireRe.exec(text);
            if (match) {
                checkAndAdd(match[1], packages);
            }
        }
    }
}

/**
 * Checks if the current package 'value' is non-native,
 * if so, adds it to the 'packages' Set
 *
 * @param {Object} value
 */
function checkAndAdd(value) {
    if (value && packages) {
        if (!nativeModules.includes(value)) {
            packages.add(value);
        }
    }
}

const parser = {parse, parseDir, parseFile};

export {parser};
