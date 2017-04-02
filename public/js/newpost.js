'use strict';
document.getElementById('submit-post').onclick = submitpostAction;

function submitpostAction(){

   // document.getElementById("new-post-form").submit();

    var  postTitle = document.getElementById("main-title").innerText;
    var content = document.getElementById("post-content").innerHTML;
    //var form = $(this);
   //$('.error',form).html('');
   //$(':submit',form).button('loading...');
    $.ajax({
        url: '/newpost',
        method: 'POST',
        data: {
            title: postTitle,
            content: content
        },
        complete: function () {
          //  $(':submit',form).button('reset');
        },
        statusCode: {
            200: function() {
                //form.html('отправились данные').addClass('alert-sucsess');
                console.log('УРА Все пришло');
            },
            403: function(jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
               // $('.error',form).html(error.message);
            }

        }
    });
   // return false;
}
