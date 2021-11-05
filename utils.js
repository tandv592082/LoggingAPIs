
exports.formatRawSheet = (data, query) => {
    const destination = data.range.split('!')[0];
    const { values } = data;
    values.shift();

    const locationRecords = values[0].map(el => ({
        title: el,
        data: [],
    }));

    values.shift();
    console.log(locationRecords);
    for (let record of values) {
        record.map((el, index) => {
            locationRecords[index].data.push(el);
        });
    }

    let records = locationRecords.map((el) => ({
        ...el,
        avg: getAvg(el.data).toFixed(2),
        range: getRange(el.data)
    }))

    records = filterRecordsWithQuery(query, records);

    return {
        destination,
        records,
    }
}

const getRange = (arr) => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return `${min} ~ ${max}`;
}

const getAvg = (arr) => {
    const sum = arr.reduce((acc, curr) => +acc + +curr, 0);
    return sum / arr.length;
}

const filterRecordsWithQuery = (queryString, result) => {
    let query = queryString.filter;

    if(!query) { 
        return result;
    }

    let newRecords = result.map(el => ({title: el.title}));
    const defaultQueryAccept = ['data', 'avg', 'range'];
    query = query.split(',');
    defaultQueryAccept.map(el => {
        if(query.includes(el)) {
            console.log(el);
            newRecords = newRecords.map((record, index) => ({...record, [el]: result[index][el]}));
        }
    })

    return newRecords;
    
}