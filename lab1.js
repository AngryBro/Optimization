function f(x,A,b) {
    return x.T().mult(A).mult(x).mult(1/2).get(1)+b.mult(x);
}
function f1(x,A,b) {
    return A.mult(x).sum(b);
}

function gradient(x0,eps,A,b,lambda) {
    var x = [x0];
    for(var i = 1; true; i++) {
        x.length++;
        x[i] = x[i-1].dif(f1(x[i-1],A,b).mult(lambda));
        if(f1(x[i],A,b).vector_norm()<eps) break;
    }
    console.log(x.length-1);
    return x[x.length-1];
}

function newton(x0,eps,A,b) {
    var x = [x0];
    for(var i = 1; true; i++) {
        if(f1(x[i-1],A,b).vector_norm()<eps) break;
        x.length++;
        x[i] = x[i-1].dif(A.invert().mult(f1(x[i-1],A,b)));
    }
    console.log(x.length-1);
    return x[x.length-1];
}

var body = document.body;
var lambda = 0.001;
var A = Matrix.random(3,3,-5,5,0);
A = A.mult(A.T());
var b = new Matrix('vector',[1,1]);
var eps = 0.1;

body.innerHTML = '\\(f(x)= \\frac{1}{2} x^T '+A.tex()+' x+ '+b.tex()+' x\\)<br><br>'+
'По методу градиентного спуска с параметром \\(\\lambda = '+lambda+'\\)<br><br>\\(x^*='+
gradient(b,eps,A,b,lambda).tex()+',~~~\\varepsilon = '+eps+'\\)<br><br>'+
'По методу Ньютона \\(x^*='+
newton(b,eps,A,b).tex()+',~~~\\varepsilon = '+eps+'\\)';
MathJax.typeset();