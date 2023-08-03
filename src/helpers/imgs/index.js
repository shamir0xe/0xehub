const imgPack = (src, alt) => {
    return {
        src: require("../../../assets/" + src),
        alt: alt
    };
}

export {
    imgPack,
}
