function make_positive(A) {
    var m = 0;
    var new_A = A.copy();
    for(var i = 1; i<=A.size.m; i++) {
        for(var j = 1; j<=A.size.n; j++) {
            m = Math.min(m,A.get(i,j));
        }
    }
    for(var i = 1; i<=A.size.m; i++) {
        for(var j = 1; j<=A.size.n; j++) {
            new_A.set(i,j,A.get(i,j)-m);
        }
    }
    return new_A;
}

function min_max(A) {
    var min = Infinity;
    for(var i = 1; i<=A.size.n; i++) {
        var max = -Infinity; 
        for(var j = 1; j<=A.size.m; j++) {
            max = Math.max(max,A.get(j,i));
        }
        min = Math.min(min,max);
    }
    return min;
}
function max_min(A) {
    var max = -Infinity;
    for(var i = 1; i<=A.size.m; i++) {
        var min = Infinity; 
        for(var j = 1; j<=A.size.n; j++) {
            min = Math.min(min,A.get(i,j));
        }
        max = Math.max(max,min);
    }
    return max;
}

// var A = new Matrix('array',[
//     [6,15,-19,-6,19,6,-17,-2],
//     [6,-14,18,0,1,6,12,-10],
//     [2,-14,14,-8,-6,3,-18,13],
//     [16,0,-14,-15,-5,18,-3,19],
//     [-2,-4,1,-7,19,-14,1,-3],
//     [-19,-6,5,-15,10,9,16,-20]
// ]).T();

var A = Matrix.random(6,8,-10,10,0);

var c = new Matrix('0',A.size.n,1);
var b = new Matrix('0',A.size.m,1);
for(var i=1; i<=Math.max(c.size.m,b.size.m); i++) {
    if(i<=c.size.m) c.set(i,1);
    if(i<=b.size.m) b.set(i,1);
}

var bottom_prise = max_min(A);
var upper_prise = min_max(A);

var original_A = A.copy();
A = make_positive(A);

var tlp = new TLP(A,b,c,false,'q');
var dual = new TLP(A.T(),c,b,false,'p');

var sol = tlp.simplex();
var q = sol.direct;
var p = sol.dual;
q = q.mult(1/q.vector_norm(1));
p = p.mult(1/p.vector_norm(1));

var html = '<br><br>'
+'Платёжная матрица: \\(A = '+original_A.tex()+'\\)<br><br>'
+'Нижняя цена игры: '+bottom_prise+',   верхняя цена игры: '+upper_prise+'<br><br>'
+'Прямая задача: \\('+tlp.tex()
+',~~~q^* = '+q.tex()+'\\)<br><br>'
+'Двойственная задача: \\('+dual.tex()
.replace('max','min')
.replace('\\leq','\\geq')+',~~~'
+'p^* = '+p.tex(5)+'\\)'
;

document.body.innerHTML = html;