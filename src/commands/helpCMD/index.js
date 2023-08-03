import contents from "./contents";
import classes from "./helpCMD.module.css";

const helpCMD = () => {
    const commandList = () => {
        return contents.commands.map((command, index) => {
            return (
                <li key={`command${index}`}>
                    <button className={classes.Command}
                    onClick={() => typeSetter(command.name)}
                    >{command.name}</button>: {command.description}
                </li>
            );
        });
    };
    return (
        <div className={classes.Container}>
            <h1>{contents.txts.title}</h1>
            <p>{contents.txts.body}</p>
            <ul>{commandList()}</ul>
        </div>
    );
};

export default helpCMD;
