function f(x,A,b) {
    return x.T().mult(A).mult(x).mult(1/2).get(1)+b.mult(x);
}
function df(x,A,b) {
    return A.mult(x).sum(b);
}
function ddf(x,A,b) {
    return A;
}

function gradient(x0,eps,A,b,lambda) {
    var x = [x0];
    for(var i = 1; true; i++) {
        x.length++;
        x[i] = x[i-1].dif(df(x[i-1],A,b).mult(lambda));
        if(f(x[i-1],A,b)<f(x[i],A,b)) {
            lambda = lambda/2;
        }
        if(lambda<eps) break;
    }
    return {
        x: x[x.length-1],
        iter: x.length-1
    };
}

function newton(x0,eps,A,b) {
    var x = [x0];
    for(var i = 1; true; i++) {
        if(df(x[i-1],A,b).vector_norm()<eps) break;
        x.length++;
        x[i] = x[i-1].dif(ddf(x,A,b).invert().mult(df(x[i-1],A,b)));
    }
    return {
        x: x[x.length-1],
        iter: x.length-1
    };
}

var body = document.body;
var n = 6;
var eps = 0.00001;
var lambda = 0.1;
var A = Matrix.random(n,n,-5,5,3);
A = A.mult(A.T());
var b = Matrix.random(n,1,-5,5,3);
var grad = gradient(b,eps,A,b,lambda);
var newt = newton(b,eps,A,b);

var html = '<br><br>\\(f(x)= \\frac{1}{2} x^T '+A.tex()+' x+ '+b.tex()+' x\\)<br><br>'+
'По методу градиентного спуска \\(x^*='+grad.x.tex(10)
+',~~~\\varepsilon = '+eps+'\\)<br><br>'
+'Количество итераций: '+grad.iter+'<br><br>'
+'По методу Ньютона \\(x^*='+newt.x.tex(10)
+',~~~\\varepsilon = '+eps+'\\)<br><br>'
+'Количество итераций: '+newt.iter;
body.innerHTML = html;
MathJax.typeset();