exports.getChunks = function (jsonToken, perChunk){
    let batches = jsonToken.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index/perChunk);
        
        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }
        
        resultArray[chunkIndex].push(item);
        
        return resultArray;
    }, [])
    return batches;
}

Array.range = function(n) {
    // Array.range(5) --> [0,1,2,3,4]
    return Array.apply(null,Array(n)).map((x,i) => i)
};

var ceil = Math.ceil;

Object.defineProperty(Array.prototype, 'chunk', {value: function(n) {
    return Array(ceil(this.length/n)).fill().map((_,i) => this.slice(i*n,i*n+n));
}});