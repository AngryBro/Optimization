class Matrix {
	constructor() {
		switch(arguments[0]) {
			case 'array': {
				if(arguments.length>=2) {
					var arr = arguments[1];
					for(var i = 0; i<arr.length; i++) {
						if(arr[0].length!=arr[i].length) {
							return new None('Столбцы разной длины');
						}
					}
					this.array = arguments[1];
					/*if(this.array.length*this.array[0].length==1) {
						return this.array[0][0];
					}*/
				}
				else {
					return new None('Нет массива элементов матрицы.');
				}
				break;
			}
			case '0': {
				if(arguments.length>=3) {
					var m = arguments[1];
					var n = arguments[2];
					var arr = [];
					for(var i = 0; i<n; i++) {
						var temp = []
						for(var j = 0; j<m; j++) {
							temp.push(0);
						}
						arr.push(temp);
					}
					return new Matrix('array',arr);
				}
				return new None('Отсутствуют размеры нулевой матрицы.');
			}
			case '1': {
				if(arguments.length>=2) {
					var n = arguments[1];
					var arr = [];
					for(var i = 0; i<n; i++) {
						var temp = []
						for(var j = 0; j<n; j++) {
							temp.push(i==j?1:0);
						}
						arr.push(temp);
					}
					return new Matrix('array',arr);
				}
				return new None('Отсутствует размер единичной матрицы.');
			}
			case 'vectors': {
				if(arguments.length>=2) {
					for(var i = 1; i<arguments.length; i++) {
						if((arguments[i].size.n!=1)||
							(arguments[i].size.m!=arguments[1].size.m)) {
								return new None('Неверные векторы');
						}
					}
					var arr = []
					for(var i = 1; i<arguments.length; i++) {
						arr.push(arguments[i].array[0]);
					}
					return new Matrix('array',arr);
				}
				return new None('Отсутствуют векторы');
			}
			case 'vector': {
				if(arguments.length>1) {
					return new Matrix('array',[arguments[1]]);
				}
				return new None('Отсутствует вектор');
			}
			default: {
				return new None('Некорректное задание матрицы');
			}
		}
		this.size = {
			m : this.array[0].length,
			n: this.array.length,
			sqr: this.array.length==this.array[0].length
		};
	}
	copy() {
		return new Matrix('array',JSON.parse(JSON.stringify(this.array)));
	}
	raw_tex() {
		var temp = [];
		var eps = (arguments.length>0)?arguments[0]:3;
		var out = new Matrix('array',this.array.slice());
		var p = Math.pow(10,eps);
		for(var i = 0; i<this.size.n; i++) {
			for(var j = 0; j<this.size.m;j++) {
				out.array[i][j] = Math.round(out.array[i][j]*p)/p;
			}
		}
		for(var i = 0; i<out.size.n; i++) {
			temp.push(out.array[i].join(' & '));
		}
		return '\\begin{pmatrix} '+temp.join(' \\\\ ')+'\\end{pmatrix}';
	}
	raw_log() {
		var log = [];
		for(var i = 0; i<this.size.m; i++) {
			log.push(JSON.stringify(this.array[i]));
		}
		console.log(log.join('\n'));
	}
	tex() {
		if(arguments.length>0) {
			return this.T().raw_tex(arguments[0]);
		}
		return this.T().raw_tex();
	}
	log() {
		this.T().raw_log();
	}
	getElem(i,j) {
		if((i<1)||(j<1)||(i>this.size.m)||(j>this.size.n)) {
			console.log('Обращение к несущетсвующему элементу ('+i+','+j+')');
			return new None('Выход за границы');
		}
		return this.array[j-1][i-1];
	}
	setElem(i,j,e) {
		if((i<1)||(j<1)||(i>this.size.m)||(j>this.size.n)) {
			console.log('Обращение к несущетсвующему элементу ('+i+','+j+')');
		}
		else {
			this.array[j-1][i-1] = e;
		}
	}
	T() {
		var arr = [];
		for(var i = 0; i<this.size.m; i++) {
			var temp = [];
			for(var j = 0; j<this.size.n; j++) {
				temp.push(this.array[j][i]);
			}
			arr.push(temp);
		}
		return new Matrix('array',arr);
	}
	mult(m_) {
		if(m_==JSON.stringify(m_)) {
			var arr = JSON.parse(JSON.stringify(this.array));
			for(var i = 0; i<arr.length; i++) {
				for(var j = 0; j<arr[0].length; j++) {
					arr[i][j] *= m_;
				}
			}
			return new Matrix('array',arr);
		}
		else {
			var _m_ = this.size.m;
			var _n_ = this.size.n;
			var _k_ = m_.size.n;
			if(_n_!=m_.size.m) {
				return new None('Перемножение несогласованных матриц');
			}
			else {
				var res = new Matrix('0',_m_,_k_);
				for(var i = 1; i<=_m_; i++) {
					for(var j = 1; j<=_k_; j++) {
						var ij = 0;
						for(var k = 1; k<=_n_; k++) {
							ij += this.getElem(i,k)*m_.getElem(k,j);
						}
						res.setElem(i,j,ij);
					}
				}
				return res;
			}
		}
	}
	minor_matrix(_j,_i) {
		var arr = [];
		for(var i=0; i<this.size.n; i++) {
			if(i!=_i-1) {
				var temp = [];
				for(var j = 0; j<this.size.m; j++) {
					if(j!=_j-1) {
						temp.push(this.array[i][j]);
					}
				}
				arr.push(temp);
			}
		}
		return new Matrix('array',arr);
	}
	det() {
		if(!this.size.sqr) {
			return new None('Попытка вычисления определителя не квадратной матрицы');
		}
		if(this.size.m*this.size.n==1) {
			return this.array[0][0];
		}
		var s = 0;
		for(var i = 0; i<this.size.m; i++) {
			s+=this.array[0][i]*((i%2)*(-2)+1)*this.minor_matrix(i+1,1).det();
		}
		return s;
	}
	minor(i,j) {
		return this.minor_matrix(i,j).det();
	}
	A(i,j) {
		return (((i+j)%2)*(-2)+1)*this.minor(i,j);
	}
	invert() {
		var res = new Matrix('0',this.size.m,this.size.n);
		if(this.size.n!=this.size.m) {
			return new None('Попытка обратить неквадратную матрицу');
		}
		var n = this.size.n;
		for(var i = 1; i<=n; i++) {
			for(var j = 1; j<=n; j++) {
				res.setElem(j,i,this.A(i,j));
			}
		}
		res = res.mult(1/this.det());
		return res;
	}
	sum(s) {
		var m = this.size.m;
		var n = this.size.n;
		if(JSON.stringify(s.size)!=JSON.stringify(this.size)) {
			return new None('Матрицы разных размеров');
		}
		var res = this.copy();
		for(var i = 0; i<n; i++) {
			for(var j = 0; j<m; j++) {
				res.array[i][j] += s.array[i][j];
			}
		}
		return res;
	}
	dif(s) {
		var m = this.size.m;
		var n = this.size.n;
		if(JSON.stringify(s.size)!=JSON.stringify(this.size)) {
			return new None('Матрицы разных размеров');
		}
		var res = this.copy();
		for(var i = 0; i<n; i++) {
			for(var j = 0; j<m; j++) {
				res.array[i][j] -= s.array[i][j];
			}
		}
		return res;
	}
	minus() {
		var m = this.size.m;
		var n = this.size.n;
		var res = this.copy();
		for(var i = 0; i<n; i++) {
			for(var j = 0; j<m; j++) {
				res.array[i][j] *=(-1);
			}
		}
		return res;
	}
}
class None {
	constructor(description) {
		this.description = description;
	}
}