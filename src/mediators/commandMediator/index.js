import commandParser from "./commandParser";
import ResponseTypes from "./responses";
import helpCMD from 'src/commands/helpCMD';
import CommandTypes from 'src/commands/types';

const commandMediator = (command) => {
    let [cmd, args] = commandParser(command);
    if (cmd === '') return ResponseTypes.BLANK;
    let output = ResponseTypes.COMMAND_NOT_FOUND;
    switch(cmd) {
        case CommandTypes.HELP:
        case CommandTypes.LS:
            output = helpCMD(...args);
            break;
        case CommandTypes.CLEAR:
            output = ResponseTypes.CLEAR;
            break;
        default:
    }
    return output;
};

export default commandMediator;
