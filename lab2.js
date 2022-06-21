function f(x,A,b) {
    return x.T().mult(A).mult(x).mult(1/2).get(1)+b.mult(x);
}
function df(x,A,b) {
    return A.mult(x).sum(b);
}
function ddf(x,A,b) {
    return A;
}

