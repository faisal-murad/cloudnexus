
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
   const user_id = urlParams.get('user_id');
   const SID = urlParams.get('SID');



   const requestData = {
      UID: user_id,
      SID: SID
   };
   fetch('http://localhost:3020/api/user/getThreshold', {
      method: "POST",
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
   })
      .then(response => {
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         return response.json();
      })
      .then(recievedData => {
         // Handle the response data
         console.log('Success:', recievedData);
         const data = recievedData;


         document.getElementById('cpuRange').value = data.cpuThreshold;
         document.getElementById('cpuSpan').innerText = `${data.cpuThreshold}%`;
         document.getElementById('ramRange').value = data.ramThreshold;
         document.getElementById('ramSpan').innerText = `${data.ramThreshold}%`;

         sessionStorage.setItem('cpuThreshold', data.cpuThreshold);
         sessionStorage.setItem('ramThreshold', data.ramThreshold);
 
      });
};

rangeSlider(); 