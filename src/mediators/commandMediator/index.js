import commandParser from "./commandParser";
import responses from "./responses";
import helpCMD from 'src/commands/helpCMD';
// import lsCMD from 'src/commands/lsCMD';
import commandTypes from 'src/commands/types';

const commandMediator = (command) => {
    let [cmd, args] = commandParser(command);
    if (cmd === '') return responses.blank;
    let output = responses.commandNotFound;
    switch(cmd) {
        case commandTypes.HELP:
            output = helpCMD(...args);
            break;
        case commandTypes.LS:
            output = helpCMD(...args);
            break;
        default:
    }
    return output;
};

export default commandMediator;
