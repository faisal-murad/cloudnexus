 
var rangeSlider = function () {
   var slider = $('.range-slider'),
      range = $('.range-slider__range'),
      value = $('.range-slider__value');

   slider.each(function () {
      value.each(function () {
         var value = $(this).prev().attr('value') + '%';
         $(this).html(value);
      });

      range.on('input', function () {
         var displayedValue = this.value == this.max ? this.value + '%' : this.value + '%';
         $(this).next(value).html(displayedValue);
      });

      // Set initial value with percentage sign
      var initialValue = range.val() == range.attr('max') ? range.val() + '%' : range.val() + '%';
      range.next(value).html(initialValue);
   });
};

rangeSlider(); 