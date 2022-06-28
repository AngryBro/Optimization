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