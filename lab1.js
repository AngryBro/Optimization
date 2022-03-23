var body = document.body;
var M = new Matrix('array',[[2,5,4],[6,5,2],[6,1,1]]);
var N = new Matrix('array',[[2,3,4],[4,5,5],[1,1,2]]);
body.innerHTML += M.tex()+N.tex()+M.sum(N).tex()+M.tex()+N.tex()