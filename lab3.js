class TLP {
    _A = undefined;
    _b = undefined;
    _c = undefined;
    _m = undefined;
    _n = undefined;
    _x = undefined;
    _canon = undefined;
    constructor(A,b,c,canon,x='x') {
        this._A = A;
        this._b = b;
        this._c = c;
        this._x = x;
        var size = A.size;
        this._m = size.m;
        this._n = size.n;
        this._canon = canon;
    }
    to_canon() {
        if(this._canon) {
            return this;
        }
        var new_c = new Matrix('0',this._m+this._n,1);
        for(var i = 1; i<=this._n; i++) {
            new_c.set(i,this._c.get(i));
        }
        var new_A = new Matrix('0',this._m,this._m+this._n);
        var I = new Matrix('1',this._m);
        for(var i = 1; i<=this._m; i++) {
            for(var j = 1; j<=this._n; j++) {
                new_A.set(i,j,this._A.get(i,j));
            }
        }
        for(var i = 1; i<=this._m; i++) {
            for(var j = 1; j<=this._m; j++) {
                new_A.set(i,j+this._n,I.get(i,j));
            }
        }
        return new TLP(new_A,this._b.copy(),new_c,true);
    }
    tex(digits = 3) {
        return `\\begin{cases}
                    `+this._c.T().tex(digits)+`\\cdot `+this._x+` \\rightarrow max\\\\
                    `+this._A.tex(digits)+`\\cdot `+this._x+(this._canon?` = `:` \\leq `)+this._b.tex(digits)+`\\\\
                    `+this._x+` \\geq 0
                \\end{cases}`;
    }
    _checkOpt(table) {
        for(var i = 3; i<=table.size.n; i++) {
            if(table.get(2,i)<0) {
                return false;
            }
        }
        return true;
    }
    _checkUnlim(table,row) {
        for(var i = 2; i<=table.size.m; i++) {
            if(table.get(i,row)>0) {
                return false;
            }
        }
        return true;
    }
    simplex() {
        if(!this._canon) {
            return this.to_canon().simplex();
        }
        var table_width = this._n+2;
        var table_height = this._m+2;
        var table = new Matrix('0',table_height,table_width);
        for(var i = 3; i<=table_width; i++) {
            table.set(1,i,i-2);
        }
        for(var i = 3; i<=table_height; i++) {
            for(var j = 3; j<=table_width; j++) {
                table.set(i,j,this._A.get(i-2,j-2));
            }
        }
        for(var i = 3; i<=table_height; i++) {
            table.set(i,2,this._b.get(i-2));
        }
        table.set(2,2,0);
        for(var i = 3; i<=table_height; i++) {
            table.set(i,1,this._n-this._m+i-2);
        }
        for(var i = 3; i<=table_width; i++) {
            table.set(2,i,-this._c.get(i-2));
        }
        var solution = {
            direct: undefined,
            dual: undefined,
            f: Infinity 
        };
        while(!this._checkOpt(table)) {
            var leadRow;
            var minElem = 0;
            for(var i = 3; i<=table_width; i++) {
                if(table.get(2,i)<minElem) {
                    minElem = table.get(2,i);
                    leadRow = i;
                }
            }
            if(this._checkUnlim(table,leadRow)) {
                console.log('Нет оптимального решения');
                return solution;
            }
            var frac = Infinity;
            var leadStr;
            var leadElem;
            for(var i = 3; i<=table_height; i++) {
                var aij = table.get(i,leadRow);
                if((aij>0)&&(table.get(i,2)/aij<frac)) {
                    frac = table.get(i,2)/aij;
                    leadStr = i;
                    leadElem = aij;
                }
            }
            for(var i = 2; i<=table_width; i++) {
                table.set(leadStr,i,table.get(leadStr,i)/leadElem);
            }
            for(var i = 2; i<=table_height; i++) {
                if(i==leadStr) continue;
                var koef = -table.get(i,leadRow);
                for(var j = 2; j<=table_width; j++) {
                    table.set(i,j,table.get(i,j)+koef*table.get(leadStr,j));
                }
            }
            table.set(leadStr,1,table.get(1,leadRow));
        }
        solution.direct = new Matrix('0',this._n-this._m,1);
        solution.dual = new Matrix('0',this._m,1);
        solution.f = table.get(2,2);
        for(var i = 3; i<=table_height; i++) {
            if(table.get(i,1)<=solution.direct.size.m) {
                solution.direct.set(table.get(i,1),table.get(i,2));
            }
        }
        for(var i = 1; i<=this._m; i++) {
            solution.dual.set(i,table.get(2,i+this._n-this._m+2));
        }
        return solution;
    }
}

// var A = new Matrix('array',
// [
//     [3,2,1,3],
//     [3,5,7,4],
//     [3,2,7,9],
//     [5,6,5,9],
//     [5,7,3,8],
//     [9,7,4,3]
// ]
// ).T();
// var b = new Matrix('vector',[9,7,8,4,1,8]);
// var c = new Matrix('vector',[9,8,4,1]);

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