const timestampToHuman = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toUTCString();
}

export default timestampToHuman
