"use strict";

import { keywords } from "./lib.sql-highlight.keywords";

export interface HighliterOptions {
    html: boolean;
    classPrefix: string;
    colors: {
        keyword?: string;
        function?: string;
        number?: string;
        string?: string;
        special?: string;
        bracket?: string;
        clear?: string;
    };
}

const DEFAULT_OPTIONS: HighliterOptions = {
    html: false,
    classPrefix: "sql-hl-",
    colors: {
        keyword: "\x1b[35m",
        function: "\x1b[31m",
        number: "\x1b[32m",
        string: "\x1b[32m",
        special: "\x1b[33m",
        bracket: "\x1b[33m",
        clear: "\x1b[0m",
    },
};

const SPLIT_CHARS = "[^a-zA-Z_]";

const highlighters = [
    {
        name: "keyword",
        regex: new RegExp(`(?:^|${SPLIT_CHARS})(?:${keywords.join("|")})(?=${SPLIT_CHARS}|$)`, "g"),
    },
    {
        name: "special",
        regex: /(=|%|\/|\*|-|,|;|:|\+|<|>)/g,
    },
    {
        name: "function",
        regex: /(\w+?)\(/g,
        trimEnd: 1,
    },
    {
        name: "number",
        regex: /(\d+)/g,
    },
    {
        name: "string",
        regex: /(["'`].*?["'`])/g,
    },
    {
        name: "bracket",
        regex: /([()])/g,
    },
];

export function highlight(sqlString: string, options: HighliterOptions): string {
    options = Object.assign({}, DEFAULT_OPTIONS, options);

    const matches = [];

    for (const hl of highlighters) {
        let match;

        // This is probably the one time when an assignment inside a condidion makes sense
        // eslint-disable-next-line no-cond-assign
        while ((match = hl.regex.exec(sqlString))) {
            matches.push({
                name: hl.name,
                start: match.index,
                length: (hl.trimEnd ? match[0].substr(0, match[0].length - hl.trimEnd) : match[0]).length,
            });
        }
    }

    const sortedMatches = matches.slice().sort((a, b) => a.start - b.start);

    // filter/exclude nested matches (matches within the last match)
    const filteredMatches = [];
    let upperBound = 0;
    for (let i = 0; i < sortedMatches.length; i++) {
        if (sortedMatches[i].start >= upperBound) {
            filteredMatches.push(sortedMatches[i]);
            upperBound = sortedMatches[i].start + sortedMatches[i].length;
        }
    }

    let highlighted = "";

    for (let i = 0; i < filteredMatches.length; i++) {
        const match = filteredMatches[i];
        const nextMatch = filteredMatches[i + 1];

        const stringMatch = sqlString.substr(match.start, match.length);

        if (options.html) {
            highlighted += `<span class="${options.classPrefix}${match.name}">`;
            highlighted += stringMatch;
            highlighted += "</span>";
        } else {
            highlighted += options.colors[match.name as keyof HighliterOptions["colors"]];
            highlighted += stringMatch;
            highlighted += options.colors.clear;
        }
        if (nextMatch) {
            highlighted += sqlString.substr(match.start + match.length, nextMatch.start - (match.start + match.length));
        } else if (sqlString.length > match.start + match.length) {
            highlighted += sqlString.substr(match.start + match.length);
        }
    }

    return highlighted;
}
