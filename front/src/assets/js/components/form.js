/* ================================================================================ */
/* ================================== КОНТАКТЫ ==================================== */
/* ================================================================================ */

/* =========================== ПРИ ЗАГРУЗКИ СТРАНИЦЫ ============================== */

$(".js-form").on("submit", function (e){

  e.preventDefault();

  const formData = {

    name: this.name.value,

    email: this.email.value,

    message: this.message.value

  }  // обьект всех полей формы и их значения

  const res = validateForm.call(this,formData); // валидилиет поля

  if(res){

    const options = {
      method: 'POST',
      headers : {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') // получаем csrftoken из куки
      },
      body: JSON.stringify(formData)
    }

    $(this).fadeOut(300,function (){

      $(this).after("<div class='contacts__answer'><div class='loader loader--center'></div></div>")

      fetch(config.requestEmail,options).then(res => {

        // обрабатываем ответ от сервера
        if(res.ok){

          // возвращаем json
          return res.json();

        }

        throw new Error("Сервер ответил ошибкой на запрос: отправить письмо");

      })
        .then(data => {

          if(data['answer']){

            $(".loader").fadeOut(0, function (){

              $(this).before(`
                <div class='answer'>
                  <div class="answer__lottie">
                    <lottie-player src="https://assets3.lottiefiles.com/packages/lf20_mtuaibjx.json"  background="transparent"  speed="1"  style="width: 166px; height: 166px;" autoplay></lottie-player>
                  </div>
                  <div class="answer__text"></div>
                </div>
              `)

              $(".answer__text").fadeOut(0, function (){
                $(this).text(`${data['answer']}!`)
              }).fadeIn(1200)

              $(this).remove()

            })

            setTimeout(() => {

              $(".contacts__answer").remove();
              this.reset()
              $(this).fadeIn(500)

            },2600)

          } else {

            throw new Error("Пришел некорректный ответ от сервера: отправить письмо");

          }

        })
        .catch(err => {

          // если есть ошибка
          console.warn(err)

        })

    })

  }

})

$(".form__input, .form__textarea").on("focus", function (e){

  $(this).removeClass("form__input--error form__textarea--error")

})


// Проверяет форму на пустые поля
function validateForm(formData){

  let flag = true

  Object.keys(formData).forEach(val => {

    if(!formData[val]){

      if($(this[val]).hasClass("form__input")){

        $(this[val]).addClass("form__input--error")

      }else {

        $(this[val]).addClass("form__textarea--error")

      }

      flag = false

    }

  });

  return flag

}

// Вытаскивает значения куки на ключу
function getCookie(name) {
	let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}
