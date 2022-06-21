function task_tex(task) {
    return `\\(
        \\begin{cases}
            `+task.c.T().tex()+`\\cdot x \\rightarrow `+task.opt+`\\\\
            `+task.A.tex()+`\\cdot x `+(task.canon?`= `:`\\leq `)+task.b.tex()+`\\\\
            x \\geq 0
        \\end{cases}
    \\)`;
}

function toCanon(task) {
    var A = task.A;
    var b = task.b;
    var c = task.c;
    var m = A.size.m;
    var n = A.size.n;
    for(var i = 0; i<m; i++) {
        c.vector_push(0);
    }
    var arrayA = A.arr();
    var I = new Matrix('1',m);
    var arrayI = I.arr();
    for(var i in arrayI) {
        arrayA.push(arrayI[i]);
    }
    A = new Matrix('array',arrayA);
    return {
        A: A,
        b: b,
        c: c,
        opt: task.opt,
        canon: true
    };
}

function simplex(canon_task) {
    //
}

var task = {
    A: new Matrix('array',[[1,2,6],[3,4,1]]),
    b: new Matrix('vector',[1,1,1]),
    c: new Matrix('vector',[2,3]),
    opt: 'max',
    canon: false
}