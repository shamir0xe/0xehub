import { useState } from "react";
import classes from "./terminal.module.css";
import { appendConditionalClass } from "src/helpers/utils";

const Terminal = (props) => {
    
    const appendHistory = () => {
        // console.log(`tha real fuck: ${props.commands.length}`);
        return props.commands.map((command, index) => (
            <div key={`cmdres#${index}`}>
                <div className={classes.Terminal}>
                    <div className={classes.Leading}>&gt;&nbsp;</div>
                    <div className={classes.Wrapper}>
                        <div className={classes.CurrentLine}>{command}</div>
                    </div>
                </div>
                <div className={classes.Response}>{props.responses[index]}</div>
            </div>
        ));
    };
    return (
        <section className={classes.Section} ref={props.containerRef}>
            {appendHistory()}
            <div className={classes.Terminal}>
                <div className={classes.Leading}>&gt;&nbsp;</div>
                <div className={classes.Wrapper}>
                    <div className={classes.CurrentLine} ref={props.terminal} />
                    <div
                        className={appendConditionalClass(
                            !props.cursorStatus,
                            classes.StopAnimation,
                            classes.Cursor
                        )}
                        ref={props.cursor}
                    />
                </div>
            </div>
        </section>
    );
};

export default Terminal;
