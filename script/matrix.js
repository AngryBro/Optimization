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
	raw_tex() {
		var temp = [];
		for(var i = 0; i<this.size.n; i++) {
			temp.push(this.array[i].join(' & '));
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
	setElem(e,i,j) {
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
			var arr = this.array;
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
			var _k_ = m_.size.m;
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
						res.setElem(ij,i,j);
					}
				}
				return res;
			}
		}
	}
}
class None {
	constructor(description) {
		this.description = description;
	}
}