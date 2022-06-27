
/* ============ Переменные =============*/

const burger = document.querySelector(".js-burger");

/* ============ События =============*/

// Мыши
burger.addEventListener("click",function (evt) {

  this.classList.toggle("burger--active");

  this.nextElementSibling.classList.toggle("header--active");

});

// Клавиатуры
window.addEventListener("keydown", function (evt){

  if(evt.keyCode === 27 || evt.code === "Escape") {

    if(burger.classList.contains("burger--active")){

      burger.classList.remove("burger--active");

      burger.nextElementSibling.classList.remove("header--active");
    }
  }
});



