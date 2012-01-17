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
            if (($.isArray(modelValue) && modelValue.indexOf(modelValue) >= 0) || modelValue === el.val()) {
              el.attr("checked", "checked");
            } else {
              el.removeAttr("checked");
            }
          } else {
            return el.val(modelValue);
          }
        });
        return $(this).bind("change", function () {
          var attrs, el, modelValue;
          attrs = {};
          el = $(this);
          modelValue = model.get(name);

          if (el.is(":checkbox")) {
            if ($.isArray(model.get(name))) {
              if (el.is(":checked")) {
                return modelValue.push(el.val());
              } else {
                attrs[el.attr("name")] = _.without(modelValue, el.val());
                return model.set(attrs);
              }
            } else {
              attrs[el.attr("name")] = !!el.is(":checked")
            }
          } else {
            attrs[el.attr("name")] = el.val();
            return model.set(attrs);
          }
        });
      });
    }
  });
}(jQuery));
