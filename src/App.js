import { useEffect, useRef, useState } from "react";
import classes from "./app.module.css";
import Terminal from "src/components/pages/terminal";
import Console from "src/helpers/terminals/viTerminal";
import commandMediator from "src/mediators/commandMediator";
import TypeMediator from "src/mediators/TypeMediator";

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
                setCommands((commands) => [...commands, command]);
                setResponses((responses) => [...responses, commandMediator(command)]);
            },
        });
        TypeMediator.initialize(virtualKeyPress);
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
