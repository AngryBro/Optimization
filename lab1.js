var body = document.body;
var M = new Matrix('array',[[2,1],[0,1]]);
var N = new Matrix('vector',[1,1]);
var MN = M.mult(N);
body.innerHTML += M.tex() + MN.tex();