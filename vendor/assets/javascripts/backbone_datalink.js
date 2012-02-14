(function ($) {
  "use strict";

  return $.extend($.fn, {
    backboneLink: function (model) {

      var copyFormToModel, copyModelToForm, el, elIsEqualTo, handleInputChange;

      copyFormToModel = function (el) {
        var attrs, checked, modelValue, propertyName;

        attrs = {};
        propertyName = el.attr("name");
        modelValue = model.get(propertyName);

        if (el.is(":checkbox")) {
          checked = el.is(":checked");

          if ($.isArray(modelValue)) {
            attrs[propertyName] = (checked) ? modelValue.slice().concat([el.val()]) : _.without(modelValue, el.val());

          } else if (/^(true|on|yes|1)$/i.test(el.val())) {
            attrs[propertyName] = checked;

          } else if (/^(false|off|no|0)$/i.test(el.val())) {
            attrs[propertyName] = !checked;

          } else {
            attrs[propertyName] = (checked) ? el.val() : null;
          }

        } else if (el.is(":radio")) {
          if (el.is(":checked")) {
            attrs[propertyName] = el.val();

          } else if (elIsEqualTo(el, modelValue)) {
            attrs[propertyName] = null;
          }

        } else {
          attrs[propertyName] = (/^(\s*|null)$/.test(el.val())) ? null : el.val();
        }

        return model.set(attrs);
      };

      copyModelToForm = function (el, modelValue) {
        if (el.is(":checkbox")) {
          if (($.isArray(modelValue) && modelValue.indexOf(el.val()) >= 0) || elIsEqualTo(el, modelValue)) {
            el.attr("checked", "checked");
          } else {
            el.removeAttr("checked");
          }

        } else if (el.is(":radio")) {
          if (elIsEqualTo(el, modelValue)) {
            el.attr("checked", "checked");
          }

        } else {
          if (modelValue === null) {
            el.val("");
          } else {
            el.val(modelValue);
          }
        }

        return el;
      };

      elIsEqualTo = function (el, modelValue) {
        var elValue;

        elValue = el.val();

        if (modelValue === undefined || modelValue === null) {
          return (elValue === null || elValue.length === 0);
        }

        return (modelValue === elValue) || (modelValue.toString() === elValue);
      };

      handleInputChange = function (e) {
        copyFormToModel($(e.target));
      };

      return $(this).find(":input").each(function () {
        var el, propertyName;

        el = $(this);
        propertyName = el.attr("name");

        // Skip unnamed inputs
        if (_.isUndefined(propertyName) || _.isEmpty(propertyName)) {
          return el;
        }

        el.bind("change", handleInputChange);

        copyModelToForm(el, model.get(propertyName));
        model.bind("change:" + propertyName, function (model, modelValue) {
          copyModelToForm(el, modelValue);
        });

        return el;
      });
    }
  });
}(jQuery));
