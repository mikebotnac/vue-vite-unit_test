const exportCSV = (array, name) => {
    const columns = array.map(Object.keys)[0]
    const plainArray = array.map(Object.values)

    let csvString = [[...columns], ...plainArray]
        .map(e => e.join(","))
        .join("\n");

    download(csvString, name || 'esmart_export.csv',)
}

const download = (content, fileName, mimeType) => {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([content], {
            type: mimeType
        }), fileName);
    } else if (URL && 'download' in a) {
        a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        location.href = 'data:application/octet-stream,' + encodeURIComponent(content);
    }
}

export default exportCSV