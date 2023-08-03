import TerminalModes from "./modes.js";
import Keys from "./keys.js";

const viTerminal = (params) => {
    const {
        ref,
        cursorRef,
        onClick = () => {},
        onModeChange = () => {},
        onLineEnd = () => {},
    } = params;
    let mode = TerminalModes.INSERT;
    let line = "";
    let count = null;
    let cursorPos = 0;
    let internalMode = InternalModes.NORMAL;
    const updateLine = () => {
        if (cursorPos < 0) cursorPos = 0;
        if (cursorPos > line.length) cursorPos = line.length;
        cursorRef.current.style.left = `${cursorPos}ch`;
        ref.current.innerHTML = stringToHtml(line);
    };
    const internalAction = (alterPos) => {
        switch (internalMode) {
            case InternalModes.DELETE:
                [line, cursorPos] = viDelete(line, cursorPos, alterPos);
                break;
            case InternalModes.DELETE_INSERT:
                [line, cursorPos] = viDelete(line, cursorPos, alterPos);
                mode = TerminalModes.INSERT;
                onModeChange(mode);
                break;
            default:
                cursorPos = alterPos;
        }
        internalMode = InternalModes.NORMAL;
    };
    const changeTerminalMode = (alterMode) => {
        mode = alterMode;
        onModeChange(mode);
        internalMode = InternalModes.NORMAL;
    };
    const onKeyPress = (e) => {
        onClick(e);
        // console.log(e);
        // console.log(line);
        if (e.key === Keys.ENTER) {
            // clear the line and execute the commands
            onLineEnd(line);
            line = "";
            cursorPos = 0;
            internalMode = InternalModes.NORMAL;
            updateLine();
            return;
        }
        switch (mode) {
            case TerminalModes.INSERT:
                if (e.key === Keys.ESCAPE) {
                    // chaning temrinal mode
                    changeTerminalMode(TerminalModes.NORMAL);
                    cursorPos -= 1;
                } else if (e.key === Keys.BACKSPACE) {
                    line =
                        line.slice(0, cursorPos - 1) +
                        line.slice(cursorPos, line.length);
                    cursorPos -= 1;
                } else if (writable(e.key)) {
                    line =
                        line.slice(0, cursorPos) +
                        e.key +
                        line.slice(cursorPos);
                    cursorPos += 1;
                }
                updateLine();
                break;
            case TerminalModes.NORMAL:
                let cnt = count === null ? 1 : count;
                if (internalMode === InternalModes.REPLACE) {
                    // replace mode have been activated, so do replace stuff
                    if (writable(e.key)) {
                        line =
                            line.slice(0, cursorPos) +
                            e.key +
                            line.slice(cursorPos + 1, line.length);
                        internalMode = InternalModes.NORMAL;
                    }
                } else if (e.key === Keys.i.toUpperCase()) {
                    // [I]: go to the begining of the line, then Insert
                    cursorPos = 0;
                    changeTerminalMode(TerminalModes.INSERT);
                } else if (e.key.toLowerCase() === Keys.i) {
                    // [i]
                    changeTerminalMode(TerminalModes.INSERT);
                } else if (e.key === Keys.a.toUpperCase()) {
                    // [A]: go to the end, then Insert
                    cursorPos = line.length;
                    changeTerminalMode(TerminalModes.INSERT);
                } else if (e.key.toLowerCase() === Keys.a) {
                    // [a]
                    changeTerminalMode(TerminalModes.INSERT);
                    cursorPos += 1;
                } else if (e.key.toLowerCase() === Keys.b) {
                    // [b/B]
                    internalAction(viWord(line, cursorPos, -cnt));
                } else if (e.key.toLowerCase() === Keys.e) {
                    // [e/E]
                    internalAction(viWord(line, cursorPos, cnt));
                } else if (e.key.toLowerCase() === Keys.w) {
                    // [w/W]
                    let alterPos = viWord(line, cursorPos - 1, 1 + cnt);
                    alterPos = viWord(line, alterPos + 1, -cnt);
                    internalAction(alterPos);
                } else if (e.key.toLowerCase() === Keys.h) {
                    // [h/H]
                    internalAction(cursorPos - 1);
                } else if (e.key.toLowerCase() === Keys.l) {
                    // [l/L]
                    internalAction(cursorPos + 1);
                } else if (e.key.toLowerCase() === Keys.x) {
                    // [x/X]
                    [line, cursorPos] = viDelete(
                        line,
                        cursorPos,
                        cursorPos + cnt
                    );
                } else if (e.key.toLowerCase() === Keys.r) {
                    // [r/R]
                    internalMode = InternalModes.REPLACE;
                } else if (e.key.toLowerCase() === Keys.d) {
                    // [d/D]
                    if (internalMode === InternalModes.DELETE) {
                        line = "";
                        cursorPos = 0;
                        internalMode = InternalModes.NORMAL;
                    } else {
                        internalMode = InternalModes.DELETE;
                    }
                } else if (e.key.toLowerCase() === Keys.c) {
                    // [c/C]
                    internalMode = InternalModes.DELETE_INSERT;
                } else if (
                    e.key.toLowerCase() === Keys.HAT ||
                    e.key === Keys.ZERO
                ) {
                    // [^/0]: go to beining of the line
                    internalAction(0);
                } else if (e.key.toLowerCase() === Keys.DOLLOR) {
                    // [$]: go to the end of the line
                    internalAction(line.length);
                } else if (e.key.toLowerCase() === Keys.PERCENTAGE) {
                    // [%]: match the paranthesis/bracket/...
                    // TODO
                } else if (e.key.toLowerCase() === Keys.FORWARD_SLASH) {
                    // [/]: search the upcomming word
                    // TODO
                }
                updateLine();
                break;
            default:
                break;
        }
    };
    const setup = () => {
        document.addEventListener("keydown", onKeyPress);
    };
    const closure = () => {
        document.removeEventListener("keydown", onKeyPress);
    };
    closure();
    setup();
    return [closure, onKeyPress];
};

const stringToHtml = (string) => {
    let html = "";
    for (let ch of string) {
        if (ch === " ") {
            html += "&nbsp;";
        } else {
            html += ch;
        }
    }
    return html;
};

const isAlpha = (ch) => ch.toUpperCase() !== ch.toLowerCase();
const isSpace = (ch) => ch === " ";
const isPunctuation = (ch) => "/\\;,.-_+=~:><\"'{}`$%^&*!".includes(ch);
const isNumber = (ch) => "0123456789".includes(ch);
const writable = (character) => {
    return (
        character.length === 1 &&
        (isNumber(character) ||
            isAlpha(character) ||
            isSpace(character) ||
            isPunctuation(character))
    );
};
const withinWord = (character) => !isSpace(character);

const viWord = (string, index, cnt) => {
    let direction = cnt / Math.abs(cnt);
    if (index >= string.length) index = string.length - 1;
    if (index < 0) index = 0;
    // console.log(`in the viWord ${index} -- direction: ${direction}`);
    const inRange = () => index < string.length && index >= 0;
    while (inRange() && cnt !== 0) {
        index += direction;
        while (inRange() && isSpace(string[index])) index += direction;
        while (inRange() && withinWord(string[index])) index += direction;
        cnt -= direction;
    }
    index -= direction;
    // console.log(`after ${index}`);
    return index;
};

const viDelete = (string, initPos, endPos) => {
    if (initPos > endPos) [initPos, endPos] = [endPos, initPos];
    return [
        string.slice(0, initPos) + string.slice(endPos, string.length),
        initPos,
    ];
};

const InternalModes = {
    NORMAL: "normal",
    REPLACE: "replace",
    DELETE: "delete",
    DELETE_INSERT: "deleteInsert",
};

export default viTerminal;
