const readFile = (path, callback) => {
    let url = require("../../../assets/" + path);
    fetch(url)
        .then((res) => res.text())
        .then((res) => callback(res));
};

export { readFile };
