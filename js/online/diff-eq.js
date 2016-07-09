var __NumbericalMethod = {
  iterations: function(n) {
    for (var i = 0; i < n; i++)
      this.iteration();
  },
  iterationsTo: function(n) {
    if (this.data.length >= n + 1) return;
    for (var i = this.data.length; i <= n; i++)
      this.iteration();
  },
  fn: function(n) {
    return this.f(this.data[n][0], this.data[n][1]);
  }
};

var EPS = 0.01;
function Dichotomy(f, a0, b0, eps) {
  if (eps == undefined) eps = EPS;
  var iteration = function(a, b) {
    var m = (a + b)/2, y = f(m);
    if (Math.abs(a - b) > eps) {
      if (f(a) * f(m) < 0) return iteration(a, m);
      else return iteration(m, b);
    }
    return m;
  };
  return iteration(a0, b0);
}

function RungeKutta4(f, t0, y0, tn, h) {
  this.data = [];
  $.extend(this, {
    f: f, y0: y0, t0: t0, tn: tn, h: h
  });
  this.data[0] = [t0, y0];
}

RungeKutta4.prototype = {
  iteration: function(n) {
    if (n === undefined) n = this.data.length;
    var tn = this.data[n - 1][0], un = this.data[n - 1][1], k1, k2, k3, k4, unext;
    k1 = this.f(tn, un);
    k2 = this.f(tn + this.h/2, un + k1 * this.h/2);
    k3 = this.f(tn + this.h/2, un + k2 * this.h/2);
    k4 = this.f(tn + this.h, un + this.h * k3);
    unext = un + this.h/6 * (k1 + 2*k2 + 2*k3 + k4);
    this.data[n] = [tn + this.h, unext];
  }
};

$.extend(RungeKutta4.prototype, __NumbericalMethod);

function LinearDiff5(f, t0, y0, tn, h) {
  this.data = [];
  $.extend(this, {
    f: f, y0: y0, t0: t0, tn: tn, h: h
  });
  var RK = new RungeKutta4(f, t0, y0, tn, h);
  RK.iterationsTo(2);
  this.data = RK.data.slice();
  this.data[0] = [t0, y0];
}

LinearDiff5.prototype = {
  iteration: function(n) {
    if (n === undefined) n = this.data.length;
    var tn = this.data[n - 1][0], un = this.data[n - 1][1], unext;//alert(this.fn(n-1))//this.data[n-1][1])
    console.log("u[" + n + "] = " + this.data[n-3][1]);
    this.data[n] = [tn + this.h, 10*this.data[n-3][1] + 9*this.data[n-2][1] - 18*this.data[n-1][1] + 3 * this.h * (this.fn(n-3) + 6*this.fn(n-2) + 3*this.fn(n-1) )];
  }
};

$.extend(LinearDiff5.prototype, __NumbericalMethod);

function ImplicitGear3(f, t0, y0, tk, h) {
  this.data = [];
  $.extend(this, {
    f: f, y0: y0, t0: t0, tk: tk, h: h
  });
  var RK = new RungeKutta4(f, t0, y0, tk, h);
  RK.iterationsTo(3);
  this.data = RK.data.slice();
  this.data[0] = [t0, y0];
}

ImplicitGear3.prototype = {
  iteration: function(n) {
    if (n === undefined) n = this.data.length;
    var tn = this.data[n - 1][0], un = this.data[n - 1][1], unext, self = this;
    unext = Dichotomy(function(x) {
      return x - 18/11 * self.data[n-1][1] + 9/11 * self.data[n-2][1] - 2/11 * self.data[n-3][1] - 6/11 * self.h * self.f(self.t0 + self.h*(n-1), x);
    }, -100, 100);
    this.data[n] = [tn + this.h, unext];
  }
};

$.extend(ImplicitGear3.prototype, __NumbericalMethod);

function ImplicitGear4(f, t0, y0, tk, h) {
  this.data = [];
  $.extend(this, {
    f: f, y0: y0, t0: t0, tk: tk, h: h
  });
  var RK = new RungeKutta4(f, t0, y0, tk, h);
  RK.iterationsTo(3);
  this.data = RK.data.slice();
  this.data[0] = [t0, y0];
}

ImplicitGear4.prototype = {
  iteration: function(n) {
    if (n === undefined) n = this.data.length;
    var tn = this.data[n - 1][0], un = this.data[n - 1][1], unext, self = this;
    unext = Dichotomy(function(x) {
      return x - 48/25 * self.data[n-1][1] + 36/25 * self.data[n-2][1] - 16/25 * self.data[n-3][1] + 3/25 * self.data[n-4][1] - 12/25 * self.h * self.f(self.t0 + self.h*(n-1), x);
    }, -100, 100);
    this.data[n] = [tn + this.h, unext];
  }
};

$.extend(ImplicitGear4.prototype, __NumbericalMethod);

var DF = function(f, t0, y0, tk) {
  $.extend(this, {f: f, t0: t0, y0: y0, tk: tk});
  return this;
};

DF.prototype = {
  t0: 0,
  y0: 0,
  tk: 1,
  LD: null,
  solveLD: function(n) {
    if (n === undefined) n = $("#de-linear-n").val();
    var h = (this.tk - this.t0) / n;
    this.LD = new LinearDiff5(this.f, this.t0, this.y0, this.tk, h);
    this.LD.iterationsTo(n);
    var tableWrap = '<tr><th>N</th><th>t<sub>N</sub></th><th>u<sub>N</sub></th>', cn;
    $.each(this.LD.data, function(i, iter) {
      if (i < 3) cn = ' class="active"';
      else cn = '';
      tableWrap += '<tr' + cn + '><td>' + i + '</td><td><span title="' + iter[0] + '" data-toggle="tooltip" data-placement="top">' + iter[0].toFixed(3) + '</span></td><td><span title="' + iter[1] + '" data-toggle="tooltip" data-placement="top">' + iter[1].toFixed(3) + '</span></td></tr>';
    });
    $("#de-linear-table").html('<table class="table table-hover">' + tableWrap + '</table>');
    $('#de-linear-table [data-toggle="tooltip"]').tooltip();
  },
  solveGear: function(n) {
    if (n === undefined) n = $("#de-gear-n").val();
    var h = (this.tk - this.t0) / n;
    this.Gear = new ImplicitGear3(this.f, this.t0, this.y0, this.tk, h);
    this.Gear.iterationsTo(n);
    var tableWrap = '<tr><th>N</th><th>t<sub>N</sub></th><th>u<sub>N</sub></th>', cn;
    $.each(this.Gear.data, function(i, iter) {
      if (i < 3) cn = ' class="active"';
      else cn = '';
      tableWrap += '<tr' + cn + '><td>' + i + '</td><td><span title="' + iter[0] + '" data-toggle="tooltip" data-placement="top">' + iter[0].toFixed(3) + '</span></td><td><span title="' + iter[1] + '" data-toggle="tooltip" data-placement="top">' + iter[1].toFixed(3) + '</span></td></tr>';
    });
    $("#de-gear-table").html('<table class="table table-hover">' + tableWrap + '</table>');
    $('#de-gear-table [data-toggle="tooltip"]').tooltip();
  },
  solveGear4: function(n) {
    if (n === undefined) n = $("#de-gear4-n").val();
    var h = (this.tk - this.t0) / n;
    this.Gear = new ImplicitGear4(this.f, this.t0, this.y0, this.tk, h);
    this.Gear.iterationsTo(n);
    var tableWrap = '<tr><th>N</th><th>t<sub>N</sub></th><th>u<sub>N</sub></th>', cn;
    $.each(this.Gear.data, function(i, iter) {
      if (i < 4) cn = ' class="active"';
      else cn = '';
      tableWrap += '<tr' + cn + '><td>' + i + '</td><td><span title="' + iter[0] + '" data-toggle="tooltip" data-placement="top">' + iter[0].toFixed(3) + '</span></td><td><span title="' + iter[1] + '" data-toggle="tooltip" data-placement="top">' + iter[1].toFixed(3) + '</span></td></tr>';
    });
    $("#de-gear4-table").html('<table class="table table-hover">' + tableWrap + '</table>');
    $('#de-gear4-table [data-toggle="tooltip"]').tooltip();
  },
  solve: function() {
    $("#de-results").removeClass("hidden");
    this.solveLD();
    this.solveGear();
    this.solveGear4();
  }
};

function clearMsg() {
  $("#de-error").html("");
  $("#de-results").addClass("hidden");
}
function errorMsg(title, msg) {
  $("#de-error").append('<div class="panel panel-danger">\
    <div class="panel-heading"><div class="panel-title">' + title + '</div></div>\
    <div class="panel-body">' + msg + '</div>\
  </div>').removeClass("hidden");
}

function makeDF(expr, t0, y0, tk) {
  var fn, check = true;;
  try {
    fn = eval("(function(t, y) { return " + expr + " })");
  } catch (e) {
    errorMsg("Equation syntax error", e.message);
    check = false;
  }
  t0 = parseFloat(t0);
  y0 = parseFloat(y0);
  tk = parseFloat(tk);
  if (isNaN(t0)) { errorMsg("Parameter t<sub>0</sub> error", "Parameter t<sub>0</sub> is not a float."); check = false; }
  if (isNaN(y0)) { errorMsg("Parameter y<sub>0</sub> error", "Parameter y<sub>0</sub> is not a float."); check = false; }
  if (isNaN(tk)) { errorMsg("Parameter t<sub>k</sub> error", "Parameter t<sub>k</sub> is not a float."); check = false; }
  if (check) {
    try {
      var x = fn(t0, y0);//alert(x);
      if (!isFinite(x)) {
        errorMsg("Test Failed", "Initial conditions return <b>" + x + "</b>.");
        check = false;
      }
    } catch (e) {
      errorMsg("Test Failed", e.message);
      check = false;
    }
  }
  if (check) return new DF(fn, t0, y0, tk);
  return false;
}

var diffEq;
$("#de-btn").click(function() {
  clearMsg();
  var expr = $("#de-f").val(), t0 = $("#de-t0").val(), y0 = $("#de-y0").val(), tk = $("#de-tk").val();
  diffEq = makeDF(expr, t0, y0, tk);
  if (diffEq)
    diffEq.solve();
});
