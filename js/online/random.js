var n_re = /^\-*[0-9]($|\.[0-9]+$)/;
function Randomizer(minValue, maxValue) {
  if (!/\./.test(minValue + "" + maxValue) && /\,/.test(minValue + "" + maxValue))
    this.likeComma = true;
  this.minValue = this.simplify(minValue);
  this.maxValue = this.simplify(maxValue);
  if (!n_re.test(this.minValue))
    this.error("Minimum value is not correct.");
  if (!n_re.test(this.maxValue))
    this.error("Maximum value is not corrent.")
  return this;
}

Randomizer.prototype = {
  onlyIntegers: true,
  error: function(m) { alert(m); },
  setInt: function(v) {
    this.onlyIntegers = v;
    return this;
  },
  plus: function(a, b) {
    var aa = a.split(''), ab = b.split('');
    console.log(aa);
  },
  random: function() {

  },
  compare: function(a, b) {
    var ax = a.split("."), bx = b.split(".");
    var ai = ax[0], bi = bx[0], ad = ax[1], bd = bx[1];
    if (ai[0] == "-" && bi[0] == "-") return -this.compare(a, b);
    else if (a[0] == "-") return -1;
    else if (b[i] == "-") return 1;
    if (ai.length > bi.length) return 1;
    else if (ai.length < bi.length) return -1;

    for (var i = 0; i < ai.length; i++) {
      if (ai[i] != bi[i]) {
        if (ai[i] > bi[i]) return 1;
        return -1;
      }
    }

    if (ad != undefined || bd != undefined) {
      if (ad == undefined) return -1;
      else if (bd == undefined) return 1;
      for (var i = 0; i < ad.length; i++) {
        if (ad[i] != bd[i]) {
          if (ad[i] > bd[i]) return 1;
          return -1;
        }
      }
    }
    return 0;
  },
  simplify: function(x) {
    return $.trim(x)
      .replace(/\,/g, ".")                          // "3,14" ~ "3.14"
      .replace(/^(\-\-)+/g, "")                     // "--90" ~ "90"
      .replace(/^0+/, "")                           // "003" ~ "3"
      .replace(/^\-0+/, "-")                        // "-03" ~ "-3"
      .replace(/(\.[0-9]+)(?:\.[0-9]+){1,}/, "$1")  // "12.34.56" ~ "12.34"
      .replace(/\.([0-9]+)0+$/, ".$1");             // "1.100" ~ "1.1"
  }
};

$("#rn-button").click(function() {
  var min = $("#rn-minimum").val().toString();
  var max = $("#rn-maximum").val().toString();
  var randomize = new Randomizer(min, max);
  console.log(randomize.plus("243.5", "123"))
});
