/* ================================================================================ */
/* ================================= МЕНЮ ========================================= */
/* ================================================================================ */


/* ============================= ПРИ ПРОКРУТКИ ==================================== */

/* красим нужный пункт меню при попадении на соответствующий ему блок при скроле */

let objParamsBox = getCoords(["#info", "#biography", "#portfolio", "#skills", "#contacts"],"#contacts",250);
scrollBox(objParamsBox);

$(window).on("scroll ",function (){

  scrollBox(objParamsBox);

});

function getCoords(array, lastBox = null, upwardDisplacement = 0) {

  const obj = {};

  for (let x = 0; x < array.length; x++){

    let element = array[x].slice(1);

    obj[element] = {

      element : array[x],
      top: Math.floor($(array[x]).offset().top),
      bottom: 0,
      height: Math.floor($(array[x]).outerHeight())

    }

    if(x !== 0){
      obj[array[x - 1].slice(1)].bottom = Math.floor($(array[x]).offset().top - 1);
    }

    if(lastBox !== null){

      if(array[x] === lastBox){
        obj[element].top-= upwardDisplacement;
        obj[element].bottom = Math.floor($(array[x]).offset().top + $(array[x]).outerHeight() - 1);

        obj[array[x - 1].slice(1)].bottom-= upwardDisplacement;
      }

    }else{

      if(x === array.length - 1){
        obj[array[x].slice(1)].bottom = Math.floor($(array[x]).offset().top + $(array[x]).outerHeight() - 1);
      }

    }

  }

  return obj;

}

function scrollBox(obj){

  for (let val in obj) {

    if(obj[val].height !== Math.floor($(obj[val].element).outerHeight())){

      objParamsBox = getCoords(["#info", "#biography", "#portfolio", "#skills", "#contacts"],"#contacts",250);

    }

    if($(window).scrollTop() >= obj[val].top && $(window).scrollTop() <= obj[val].bottom){

      $('.menu__link[href="'+ obj[val].element +'"]').addClass("menu__link--active");

    }else{

      let link = $('.menu__link[href="'+ obj[val].element +'"]');

      if($(link).hasClass("menu__link--active")){

        link.removeClass("menu__link--active");

        link.blur();

      }

    }

  }
}

/* ============================== ПРИ КЛИКЕ =================================== */

/* при нажатии на пункт скролит в соответствующему этому пункту блоку */

$('a[href^="#"]').on("click",function (e){

  // отменяем поведения по умолчанию
  e.preventDefault();

  //находим значения атрибута href
  const nameBox = $(this).attr("href");

  //находим координаты блока относительно верха страницы
  const coordinatesBox = Math.round($(nameBox).offset().top);

  // скролим к этому блоку
  window.scrollTo({
    top: coordinatesBox,
    behavior: "smooth"
  });

  /*  скролим к этому блоку если на Jquery
    // $("html, body").animate({
    //   scrollTop: coordinatesBox
    // },{
    //   duration: 300,   // по умолчанию «400»
    //   easing: "linear" // по умолчанию «swing»
    // })*/

  // улаляем всплывающию подсказку
  $(".menu__hint").remove();

  // отбираем шапку сайта
  const header = $("#header");

  // если у шапки есть класс header--active
  if(header.hasClass("header--active") ){

    // удаляем header--active и burger--active
    $(header).removeClass("header--active");
    $(".js-burger").removeClass("burger--active");
  }

  // если открыто модальное окно "Подробнее"
  if($(".modal").hasClass("modal--active") ){

    //закрываем окно
    $(".button__modal").trigger("click");

  }

});

/* ============================== ПРИ НАВЕДЕНИИ =================================== */

const linkMenu = $(".menu__link");

// курсор наводится на элемент
$(linkMenu).on("mouseenter",function (e){

  const nameItemMenu = $(this).attr("aria-label");

  $(this).append(`<span class="menu__hint">${nameItemMenu}</span>`);
  $(this).find(".menu__svg").addClass("menu__svg--pointerEvents");

});

// курсор перемещается по элементу
$(linkMenu).on("mousemove",function (e){

  $(this).find(".menu__hint").css({
    top: e.offsetY + 15 +"px",
    left: e.offsetX + 15 + "px"
  });
});

// курсор покидает элемент
$(linkMenu).on("mouseleave",function (e){

  $(".menu__hint").remove();
  $(".menu__svg").removeClass("menu__svg--pointerEvents");

});

