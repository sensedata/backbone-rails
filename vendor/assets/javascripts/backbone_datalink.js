(function ($) {
  "use strict";

  return $.extend($.fn, {
    backboneLink: function (model) {
      return $(this).find(":input").each(function () {
        var copyFormToModel, copyModelToForm, el, elIsEqualTo, name;

        el = $(this);
        name = el.attr("name");

        if (_.isUndefined(name) || _.isEmpty(name)) {
          return;
        }

        elIsEqualTo = function (modelValue) {
          if (modelValue === el.val()) {
            return true;
          } else if (modelValue === undefined) {
            
          }
          return (modelValue === el.val()) || (modelValue !== undefined && modelValue.toString() === el.val());
        };

        copyModelToForm = function () {
          var modelValue;

          modelValue = model.get(name);
          if (el.is(":checkbox")) {
            if (($.isArray(modelValue) && modelValue.indexOf(el.val()) >= 0) || elIsEqualTo(modelValue)) {
              el.attr("checked", "checked");
            } else {
              el.removeAttr("checked");
            }

          } else if (el.is(":radio")) {
            if (elIsEqualTo(modelValue)) {
              el.attr("checked", "checked");
            }
          } else {
            (modelValue === null) ? el.val("") : el.val(modelValue);
          }

          return el;
        };

        copyFormToModel = function () {
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

          } else if (el.is(":radio")) {
            if (el.is(":checked")) {
              attrs[name] = el.val();

            } else if (elIsEqualTo(modelValue)) {
              attrs[name] = null;
            }

          } else {
            attrs[name] = (/^(\s*|null)$/.test(el.val())) ? null : el.val();
          }

          return model.set(attrs);
        };

        copyModelToForm();
        model.bind("change:" + name, copyModelToForm);
        el.bind("change", copyFormToModel);

        return el;
      });
    }
  });
}(jQuery));
