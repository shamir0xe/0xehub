import { useEffect, useRef, useState } from "react";
import classes from "./app.module.css";
import Terminal from "src/components/pages/terminal";
import Console from "src/helpers/terminals/viTerminal";
import commandMediator from "src/mediators/commandMediator";
import TypeSetterMediator from "src/mediators/TypeSetterMediator";
import ResponseTypes from "src/mediators/commandMediator/responses";

function App() {
    const terminalRef = useRef(null);
    const cursorRef = useRef(null);
    const containerRef = useRef(null);
    const [animation, setAnimation] = useState(true);
    const [commands, setCommands] = useState([]);
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        let animationTimeout = null;
        const delayAnimation = () => {
            setAnimation(false);
            clearTimeout(animationTimeout);
            animationTimeout = setTimeout(() => setAnimation(true), 200);
        };

        const [closure, virtualKeyPress] = Console({
            ref: terminalRef,
            cursorRef: cursorRef,
            onClick: delayAnimation,
            onLineEnd: (command) => {
                let response = commandMediator(command);
                if (response === ResponseTypes.CLEAR) {
                    setCommands((commands) => []);
                    setResponses((responses) => []);
                } else {
                    setCommands((commands) => [...commands, command]);
                    setResponses((responses) => [
                        ...responses,
                        commandMediator(command),
                    ]);
                }
            },
        });
        TypeSetterMediator.initialize(virtualKeyPress);
        // TODO, remove this
        setTimeout(() => TypeSetterMediator.enter("help"), 500);
        return () => {
            return closure();
        };
    }, []);

    useEffect(() => {
        containerRef.current.scroll(0, containerRef.current.scrollHeight);
    }, [responses]);

    return (
        <div className={classes.Canvas}>
            <Terminal
                containerRef={containerRef}
                terminal={terminalRef}
                cursor={cursorRef}
                cursorStatus={animation}
                commands={commands}
                responses={responses}
            />
        </div>
    );
}

export default App;
