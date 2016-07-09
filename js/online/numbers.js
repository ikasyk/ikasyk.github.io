NA = {
  $INPUT: $("#na-input"),
  $SUBMIT: $("#na-submit"),
  $RESULT: $("#na-result")
};

NA.isRomanNumber = function(s) {
  return /^(M{0,3})(D?C{0,3}|C[DM])(L?X{0,3}|X[LC])(V?I{0,3}|I[VX])$/.test(s);
};

var constMatcher = function(q, cb) {
  var matches = [], substringRegex = new RegExp(q, "i");
  q = $.trim(q);

  $.each(NA.CONSTANTS, function(name, str) {
    if (substringRegex.test(name)) {
      matches.push(name);
    }
  });

  cb(matches);
};

NA.CONSTANTS = {
  "E": Math.E,
  "LN10": Math.LN10,
  "LN2": Math.LN2,
  "LOG10E": Math.LOG10E,
  "LOG2E": Math.LOG2E,
  "PI": Math.PI,
  "SQRT1_2": Math.SQRT1_2,
  "SQRT2": Math.SQRT2
};

NA.METHODS = {
  "sqrt(%d)": function(a) { return Math.sqrt(a); }
};

NA.$INPUT.typeahead({
  hint: false,
  highlight: true,
  minLength: 1
},
{
  name: 'const',
  source: constMatcher
});

// Submit css-height fix
NA.$SUBMIT.height(NA.$SUBMIT.parent().height()-14);
