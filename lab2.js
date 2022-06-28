function f(x,A,b) {
    return x.T().mult(A).mult(x).mult(1/2).get(1)+b.mult(x);
}
function df(x,A,b) {
    return A.mult(x).sum(b);
}
function ddf(x,A,b) {
    return A;
}

function L(x,y,x0,r,A,b) {
    return f(x,A,b)+y*(x.dif(x0).mult(x.dif(x0))-r*r);
}

function dL(x,y,x0,A,b,r) {
    var I = new Matrix('1',A.size.n);
    var l =  A.sum(I.mult(2*y)).mult(x).sum(b).sum(x0.mult(-2*y));
    l.vector_push(x.dif(x0).mult(x.dif(x0))-r*r);
    return l;
}

function W_(x0,x,y,A) {
    var n = A.size.n;
    var I = new Matrix('1',n);
    var W = new Matrix('0',n+1,n+1);
    var A2I = A.sum(I.mult(2*y));
    var xx0 = x.dif(x0).mult(2);
    for(var i = 1; i<=n; i++) {
        for(var j = 1; j<=n; j++) {
            W.set(i,j,A2I.get(i,j));
        }
    }
    for(var i = 1; i<=n; i++) {
        W.set(i,n+1,xx0.get(i));
        W.set(n+1,i,xx0.get(i));
    }
    return W;
}

function step(xk_,x0_,A,b,r) {
    var x0 = x0_.copy();
    var xk = xk_.copy();
    var y = xk.vector_pop();
    x0.vector_pop();
    var W = W_(x0,xk,y,A);
    return xk_.dif(W.mult(dL(xk,y,x0,A,b,r)));
}

var A = new Matrix('array',[[20,-18,-4,6],[-18,8,4,2],[-4,4,20,-6],[6,2,-6,12]]);
var b = new Matrix('vector',[9,3,8,10]);
var x = [new Matrix('vector',[2,7,-3,8])];
var r = 15;

x[0].vector_push(0);

for(var i = 1; i<=3; i++) {
    x.length++;
    x[i] = step(x[i-1],x[0],A,b,r);
}

x[x.length-1].log()