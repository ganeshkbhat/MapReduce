


function ca(f) {
    console.log(f);
    return f;
}

function cas(f) {
    const s = function (f) {
        return ca(f);
    }.bind(ca)
    return s(f);
}

cas("farse");
