// Load App's css (scss), scss :sass+css
import "../scss/app.scss";
import { sum } from "./math.js";

document.addEventListener("DOMContentLoaded", async () => {  
  const res = await axios.get(
    "/api/v1/translation/translate?src_lang=kr&target_lang=en&query=안녕",
    {
      headers: {
        Authorization: `KakaoAK ${TRANSLATE_KEY}`,
      },
    }
  ); 
  console.log(res.data);  
  console.log(sum(10,20));
});

(function($) {    
$(document).ready(function() {   
  console.log('=========== hi');
  $('#exampleModal').on('shown.bs.modal', function () {
    console.log('======= model')
  })
 });    
})(jQuery);