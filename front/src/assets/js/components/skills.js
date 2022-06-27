/* ================================================================================ */
/* ================================= МОИ НАВЫКИ =================================== */
/* ================================================================================ */

/*  Слайдер  |  https://kenwheeler.github.io/slick/  */
//= ../../../../node_modules/slick-carousel/slick/slick.js

/*  Круговая диаграмма  |  http://rendro.github.io/easy-pie-chart  */
//= ../library/jquery.easypiechart.js

// погрузчик
$('.skills')
  .find('.skills__title')
  .after('<div class="loader"></div>');

/* =========================== ПРИ ЗАГРУЗКИ СТРАНИЦЫ ============================== */

// отпрвляем fetch запрос на сервер и выводим категории навыков
fetch(config.requestSkills,{method: 'get'})
  .then(res => {

    // обрабатываем ответ от сервера
    if(res.ok){

      // возвращаем json
      return res.json();

    }

    throw new Error("Сервер ответил ошибкой на запрос: вывести список скилов по категориям");

  })
  .then(data => {

    // отрабатываем данные пришедшие от сервера
    const html = data.map(cat => {

      if(cat.skill.length !== 0){

        return renderCategory(cat)

      }

    })

    // удаляем погрузчик
    $('.skills')
      .find('.loader')
      .remove();

    // добавляем категории на страницу
    $('.skills__inner')
      .append(html.join(' '))

  })
  .then(() => {

    /* вызываем слайдер */
    $(".js-carousel").slick({
      arrows: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: false,
      swipe: false,
      mobileFirst: true,
      infinite: false,
      prevArrow: "<button type='button' class='slick-prev'><span class='visually-hidden'>Предыдущий слайдер</span></button>",
      nextArrow: "<button type='button' class='slick-next'><span class='visually-hidden'>Следующий слайдер</span></button>",
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            speed: 500,
          }
        },
        {
          breakpoint: 1499,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 2,
            speed: 500,
          }
        },
      ]
    });

    /* вызываем круговую диаграмму */

    $('.element__chart').easyPieChart({
      barColor: "#FF9301",
      trackColor: "#242424",
      scaleColor: false,
      lineWidth: 10,
      size: 91,
      lineCap: "butt",
      animate: 1300
    });

  })
  .then(() => {

    /* ========================== ПРИ КЛИКЕ НА КАРТОЧКУ НАВЫКОВ ============================== */

    const mapTimeout = new Map(); // хранит значения id setTimeout на 15 сек карточки

    $('.element').on("click",function () {

      const elementId = this.dataset.order; // находит порядковый номер карточки

      // если не существует класса element--animationRear
      if(!$(this).hasClass("element--animationRear")){

        const chart = $(this).find(".element__chart"); // находит блок круговой диаграммы
        const diagramValue = this.querySelector(".element__chart").dataset.percent; // находит проценты

        // находим блок количество проектов | выбираем его значения | сбрасываем значения на 0
        const quantityElement = this.querySelector(".element__quantity");
        const quantityValue = quantityElement.dataset.quantity;
        quantityElement.innerHTML = "0";

        // находим блок количество процентов | сбрасываем значения на 0
        this.querySelector(".element__percent").innerHTML = "0";

        // http://rendro.github.io/easy-pie-chart
        chart.data('easyPieChart').disableAnimation(); // отключаем анимацию
        chart.data('easyPieChart').update(0); // скидываем полосу анимации на 0

        $(this).addClass("element--animationRear");

        // проверяем существует ли класс element--animationFront
        if($(this).hasClass("element--animationFront")){

          // если существует удаляем
          $(this).removeClass("element--animationFront");

        }

        // анимация круговой диаграммы
        setTimeout( () => {

          // http://rendro.github.io/easy-pie-chart
          chart.data('easyPieChart').enableAnimation(); // включаем анимацию
          chart.data('easyPieChart').update(diagramValue); // даем нужный процент из переменной diagramValue

          // счетчики процентов и кол-во проектов
          count(this.querySelector(".element__percent"),diagramValue,(1500 / diagramValue) - (0.13 * (1500 / diagramValue)));
          count(this.querySelector(".element__quantity"),quantityValue,(1500 / quantityValue) - (0.13 * (1500 / quantityValue)));

        },1500);


        // через 10 секунд переворачивает карточку
        let idTimeout = setTimeout( () => {

          if($(this).hasClass("element--animationRear")) {

            $(this).addClass("element--animationFront");
            $(this).removeClass("element--animationRear");

          }

        },15000);

        mapTimeout.set(elementId, idTimeout); // добавляем id setTimeout в Map объект
      }
      // если сушествует класс element--animationRear
      else{

        // отменяет idTimeout
        if(mapTimeout.has(elementId)){
          clearTimeout(mapTimeout.get(elementId));
          mapTimeout.delete(elementId);
        }

        $(this).addClass("element--animationFront");
        $(this).removeClass("element--animationRear");

      }

    });

    /* ========== ПРИ КЛИКЕ НА ПОЛЗУНОК ВКЛЮЧИТЬ ИЛИ ВЫКЛЮЧИТЬ СЛАЙДЕР ============= */

    const mapSlick = new Map(); // хранит слайдера со всеми событиями

    $(".skills__slider-bar").on("click",function () {

      // находим родителя родительского блока
      const parentElement = $(this).parent().parent();

      // находим братский элемент вверху и берем его текст
      const textCategory = $(this).prev().text();

      // поздаем пустой массив
      const elementId = [];

      // проходимся в цикле по элементам и в массив ложим их дата атрибут order
      parentElement.find(".element").each(function (index, element) {
        elementId[index] = this.dataset.order;
      })

      // проходимся в цикле по массиву
      for(let i = 0; i < elementId.length; i++){

        // если в обьекте mapTimeout ключ из массива
        if(mapTimeout.has(elementId[i])){

          // очищаем таймер
          clearTimeout(mapTimeout.get(elementId[i]));
          // удаляем элемент из обьекта mapTimeout
          mapTimeout.delete(elementId[i]);

        }

      }

      // скрываем блок за 300ms и выполняем колбэк функцию
      parentElement.find(".skills__carousel-wrapper").fadeOut(300,() =>{

        // если и эмемента this нет класса slider-bar--destroy
        if(!$(this).hasClass("slider-bar--destroy")){

          $(this).addClass("slider-bar--destroy");
          $(this).attr("title", "Включить слайдер")

          const deleteItem = parentElement.find(".js-carousel .skills__item").detach();

          const deleteSlick = parentElement.find(".js-carousel").detach();

          mapSlick.set(textCategory, deleteSlick); // добавляем id setTimeout в Map объект

          parentElement.find(".skills__carousel-wrapper").append("<div class='skills__tile'></div>");

          parentElement.find(".skills__tile").append(deleteItem);

          parentElement.find(".element").removeClass("element--animationFront element--animationRear");

        }
        // если и эмемента this есть класс slider-bar--destroy
        else{

          if(mapSlick.has(textCategory)){

            const deleteItem = parentElement.find(".skills__tile .skills__item").detach();

            parentElement.find(".skills__tile").remove();
            parentElement.find(".skills__carousel-wrapper").append(mapSlick.get(textCategory));

            parentElement.find(".skills__inner-item").each(function (index, element) {
              $(element).append(deleteItem[index]);
            });

            parentElement.find(".element").removeClass("element--animationFront element--animationRear");

            mapSlick.delete(textCategory);
          }

          $(this).removeClass("slider-bar--destroy");
          $(this).attr("title", "Выключить слайдер")
        }

      }).fadeIn(300);

    });

    /* ========== ПРИ НАЖАТИИ С КЛАВИАТУРЫ НА ПОЛЗУНОК ВКЛЮЧИТЬ ИЛИ ВЫКЛЮЧИТЬ СЛАЙДЕР ================= */

    $(window).on("keydown", function (evt){

      // если нажата клавиша Enter
      if(evt.key === "Enter" || evt.keyCode === 13) {

        // проверяем элемент на которым произошло событие есть класс skills__slider-bar
        if($(evt.target).hasClass("skills__slider-bar") ){

          // затускаем событие click у элемента
          $(evt.target).trigger("click");

        }
      }

    });

    /* ======== ПРОВЕРЯЕМ НУЖЕН ЛИ НАМ АКТИВНЫЙ ПОЛЗУНОК ДЛЯ ВЫКЛЮЧЕНИЯ СЛАЙДЕРА ========== */

    // находим все блоки навыков и проходимся по ним с цикле
    $(".skills__box").each(function (index, element) {

      // считаем карточки навыков в блоке
      const countItem = $(this).find(".skills__item").length

      // получаем размер окна браузера
      const viewportScreen = window.innerWidth;

      // если ширина окна меньше 768 и карточек навыков меньше 2
      if(viewportScreen < 768 && countItem < 2){

        // вызываем функцию которая блокирует режим переключения в слайдер
        blockSlider(this);
      }

      // если ширина окна меньше 1200 и карточек навыков меньше 3
      if(viewportScreen < 1200 && countItem < 3){

        // вызываем функцию которая блокирует режим переключения в слайдер
        blockSlider(this);

      }

      // если ширина окна меньше 1500 и карточек навыков меньше 4
      if(viewportScreen < 1500 && countItem < 4){

        // вызываем функцию которая блокирует режим переключения в слайдер
        blockSlider(this);

      }

      // если ширина больше 1500 и карточек навыков меньше 5
      if(viewportScreen >= 1500 && countItem < 5){

        // вызываем функцию которая блокирует режим переключения в слайдер
        blockSlider(this);

      }

    })

  })
  .catch(err => {

    // если есть ошибка
    console.warn(err);

  });

// функция считает от 0 до параметра "number" через интервал заданный параметром "interval"
function count (element,number,interval) {

  let num = +number;

  let item = 0;

  let fun = setInterval(function(){
    item +=1;
    if(item === num){
      clearInterval(fun);
    }
    element.innerHTML = item;
  },interval);
}

/* деактирирует ползунок слайдера */
function blockSlider(element){

  $(element).find(".skills__slider-bar")
    .addClass("slider-bar--off")
    .removeAttr("title")
    .attr("tabindex", "-1")
    .off("click");

}

/* отрисовывает категории */
function renderCategory(cat, options = {}) {

  // Шаблон
  return `
    <section class="skills__box">
      <div class="skills__category-wrapper">
        <h3 class="skills__category">${ cat.category }</h3>
        <div class="skills__slider-bar slider-bar" tabindex="0" title="Выключить слайдер">
          <div class="slider-bar__toggle"></div>
        </div>
      </div>
      <div class="skills__carousel-wrapper">
        <div class="skills__carousel js-carousel">
          ${ cat.skill.map(skill => renderSkills(skill)).join(' ') }
        </div>
      </div>
    </section>
  `

}

/* отрисовывает навыки */
function renderSkills(skill, options = {}) {

  // Шаблон
  return `
    <div class="skills__inner-item">
      <div class="skills__item">
        <article class="element" data-order="${ skill.id_skill }">
          <header class="element__header">
            <img class="element__img" src="${ skill.s_img }" width="123" height="123" loading="lazy" alt="${ skill.s_name }">
            <h4 class="element__title">${ skill.s_name }</h4>
            <p class="element__description">${ skill.s_description }</p>
          </header>
          <footer class="element__footer">
            <div class="element__name">${ skill.s_name }</div>
            <ul class="element__list">
              <li class="element__item">
                <div class="element__text">Использовал в проектах</div>
                <div class="element__quantity" data-quantity="${ skill.s_quantity }">${ skill.s_quantity }</div>
              </li>
              <li class="element__item">
                <div class="element__text">Уровень владения</div>
                <div class="element__chart" data-percent="${ skill.s_level }">
                  <span class="element__percent">${ skill.s_level }</span>
                </div>
              </li>
            </ul>
          </footer>
        </article>
      </div>
    </div>
  `
}






