function CapsLockOff(text) {
  this.t = text;
  return this.change();
};

CapsLockOff.prototype = {
  change: function() {
    var t_arr = [];
    for (var i = 0; i < this.t.length; i++) {
      if (this.t[i].toUpperCase() == this.t[i]) {
        t_arr[i] = this.t[i].toLowerCase();
      } else {
        t_arr[i] = this.t[i].toUpperCase();
      }
    }
    this.new_t = t_arr.join("");
  },
  setText: function(text) {
    return this.t = text;
  }
};

var cpo = new CapsLockOff("");
var changeTextEvent = function() {
  var t_in = $("#cl-input-text");
  $("#cl-result").removeClass("hidden");
  cpo.setText(t_in.val());
  cpo.change();
  $("#cl-output-text").val(cpo.new_t).height(t_in.height());
};

$("#cl-submit").click(changeTextEvent);
$("#cl-input-text").bind("input", changeTextEvent);
