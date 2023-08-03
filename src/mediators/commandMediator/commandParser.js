const commandParser = (line) => {
    let args = line.split(" ");
    if (args.length === 0) return ['', []];
    return [args[0].toLowerCase(), args.slice(1)];
}
export default commandParser;
