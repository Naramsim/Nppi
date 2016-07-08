import * as fs from 'fs';
import * as path from 'path';

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

function parse(flags, toParse) {
    try {
        if (toParse.length === 0) {
            toParse = ['.'];
        }
        toParse.forEach(elegible => {
            const fileStat = fs.statSync(elegible);
            if (fileStat) {
                if (fileStat.isFile()) {
                    parseFile(elegible);
                } else if (fileStat.isDirectory()) {
                    parseDir(flags, elegible);
                } else {
                    console.log('Input not processable');
                }
            }
        });
        return packages;
    } catch (err) {
        console.log('No files/dir matches input');
    }
}

function parseDir(flags, dir = '.') {
    try {
        if (!excludedDirs.includes(dir)) {
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

function checkAndAdd(value) {
    if (value && packages) {
        if (!nativeModules.includes(value)) {
            packages.add(value);
        }
    }
}

const parser = {parse, parseDir, parseFile};

export {parser};
