function f(x,A,b) {
    return x.T().mult(A).mult(x).mult(1/2).get(1)+b.mult(x);
}

function L(y,A,b,x0) {
    var I = new Matrix('1',A.size.n);
    var x = A.sum(I.mult(2*y)).invert().mult(x0).mult(2*y);
    return {
        x: x,
        f: f(x,A,b) 
    };
}

var A = Matrix.random(4,4,-5,5,0);
A = A.mult(A.T());
var b = Matrix.random(4,1,-5,5,0);
var x0 = Matrix.random(4,1,-5,5,0);
var r = 10;
var t = [];
var solution = {};

for(var y = 0; y<=5; y+=0.01) {
    t.push(L(y,A,b,x0));
}

for(var i = 0; i<t.length-1; i++) {
    if((t[i+1].f>t[i].f)&&(t[i].x.dif(x0).vector_norm(2)<=r)) {
        solution.x = t[i].x;
        solution.f = t[i].f;
        break;
    }
}

var html = '<br><br>'
+'\\(f_0(x) = x^T '+A.tex()+' x + '
+b.tex()+' x \\)<br><br>'
+'Оптимальное решение: \\(x^* = '+solution.x.tex(5)
+',~~~f_0(x^*) = '+solution.f+'\\)';
document.body.innerHTML = html;