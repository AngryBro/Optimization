var A = Matrix.random(8,6,1,10,0);
var b = Matrix.random(8,1,1,10,0);
var c = Matrix.random(6,1,1,10,0);
var not_canon = new TLP(A,b,c,false);
var canon = not_canon.to_canon();
var dual = new TLP(A.T(),c,b,false,'y');
var sol = canon.simplex();
var html = '<br><br>ЗЛП:   '
+'\\('+not_canon.tex()+'\\);  '
+'Каноническая форма: '
+'\\('+canon.tex()+'\\)<br><br>'
+'Решение: \\(c^Tx^* = '+sol.f+',~~~x^* = '+sol.direct.tex()+'\\)<br><br>'
+'Двойственная задача:   '
+'\\('+dual.tex().replace('\\leq','\\geq').replace('max','min')+'\\)<br><br>'
+'Решение двойственной задачи:   '
+'\\(b^Ty^* = '+sol.f+',~~~y^* = '+sol.dual.tex()+'\\)<br><br>'
+'Проверка решения:<br><br>'
+'\\(c^Tx^* = '+c.mult(sol.direct)+',~~~b^Ty^* = '+b.mult(sol.dual)+'\\)'
;
document.body.innerHTML = html;