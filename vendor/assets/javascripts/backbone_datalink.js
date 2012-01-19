(function ($) {
  "use strict";

  return $.extend($.fn, {
    backboneLink: function (model) {
      return $(this).find(":input").each(function () {
        var el, name;

        el = $(this);
        name = el.attr("name");

        model.bind("change:" + name, function () {
          var modelValue;

          modelValue = model.get(name);
          if (el.is(":checkbox")) {
            if (($.isArray(modelValue) && modelValue.indexOf(el.val()) >= 0) || modelValue === el.val()) {
              el.attr("checked", "checked");
            } else {
              el.removeAttr("checked");
            }
          } else {
            el.val(modelValue);
          }

          return el;
        });

        return $(this).bind("change", function () {
          var attrs, checked, el, modelValue;
          attrs = {};
          el = $(this);
          modelValue = model.get(name);

          if (el.is(":checkbox")) {
            checked = el.is(":checked");

            if ($.isArray(modelValue)) {
              attrs[name] = (checked) ? modelValue.slice().concat([el.val()]) : _.without(modelValue, el.val());

            } else if (/^(true|on|yes|1)$/i.test(el.val())) {
              attrs[name] = checked;

            } else if (/^(false|off|no|0)$/i.test(el.val())) {
              attrs[name] = !checked;

            } else {
              attrs[name] = (checked) ? el.val() : null;
            }

          } else {
            attrs[name] = el.val();
          }

          return model.set(attrs);
        });
      });
    }
  });
}(jQuery));
