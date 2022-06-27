/* ================================================================================ */
/* ================================= ПОРТФОЛИО ==================================== */
/* ================================================================================ */

// погрузчик
$('.portfolio')
  .find('.portfolio__tab')
  .after('<div class="loader"></div>');

// отпрвляем fetch запрос на сервер и выводим привью проектов
fetch(config.requestAllProject,{method: 'get'})
  .then(res => {

    // обрабатываем ответ от сервера
    if(res.ok){

      // возвращаем json
      return res.json();

    }

    throw new Error("Сервер ответил ошибкой на запрос: вывести список проектов из портфолио");

  })
  .then(data =>{

    // отрабатываем данные пришедшие от сервера
    const html = data.map(post => renderPost(post))

    // удаляем погрузчик
    $('.portfolio')
      .find('.loader')
      .remove();

    // добавляем посты на страницу
    $('.portfolio__list')
      .prepend(html.join(' '))


    // если массив с постами не пустой
    if(html.length){

      const numToShowDefault = 5;

      // Сколько показывать элементов При нажатии по кнопке "Показать еще"
      const numToShow = 4;

      // Отбираем в набор все элементы которые будут показывать по клику по кнопки "Показать еще"
      let listPortfolio = $(".portfolio__item--hide:not(:last-child)");

      // Считаем количество элементов
      let numInList = listPortfolio.length;

      // Отбираем кнопку показать еще
      let buttonMore = $(".js-more__button");

      // Если общиее количество элементов больше чем сколько нужно показывать по умолчанию.
      if (numInList > numToShowDefault) {

        // показываем блок показать еще
        buttonMore.parent().parent().show();

      }

      // показываем первые N элементов
      listPortfolio.slice(0, numToShowDefault).fadeIn(300);

      /* ================================== ПРИ КЛИКЕ ==================================== */

      /* при нажатии на таб "Все | На заказ | сортирует какие привью показывать */
      $(".portfolio__tab-link").click(function(e) {

        // отменяем действия по умолчанию
        e.preventDefault();

        // получаем дата атрибут активного элемента
        let itemActive = this.dataset.tab.toLowerCase();


        // скрываем блок за 100ms и выполняем колбэк функцию
        $(".portfolio__list").fadeOut(100,() => {

          // скрываем блок "показать еще"
          buttonMore.parent().parent().hide();

          // отбираем в набор классы "portfolio__tab-link" и удаляем у них класс portfolio__tab-link--active и атрибут tabindex
          $(".portfolio__tab-link")
            .removeClass("portfolio__tab-link--active")
            .removeAttr("tabindex");

          // классу по которому произошел клик добавляем класс и атрибут tabindex
          $(this)
            .addClass("portfolio__tab-link--active")
            .attr("tabindex", "-1")
            .blur();

          // скрываем все элементы
          listPortfolio.hide();

          // если в переменная itemActive не равна Все
          if(itemActive !== "все"){
            console.log(itemActive)

            // перезаписываем переменную
            listPortfolio = $(".portfolio__item--hide[data-tabs='"+ itemActive +"']");

          }
          // иначе приводим перемнную к первоначальному значению
          else{

            // перезаписываем переменную
            listPortfolio = $(".portfolio__item--hide:not(:last-child)");

          }

          // Считаем количество элементов
          numInList = listPortfolio.length;


          // Если общиее количество элементов больше чем сколько нужно показывать по умолчанию.
          if (numInList > numToShowDefault) {

            // показываем блок показать еще
            buttonMore.parent().parent().show();

          }

          // показываем первые N элементов
          listPortfolio.slice(0, numToShowDefault).show();

        }).fadeIn(300); // Показываем блок за 300ms

      });

      /* при нажатии на кнопку показать еще */
      buttonMore.click(function(e) {

        // отменяем действия по умолчанию
        e.preventDefault();

        // находим все элементы которые видимые
        let showing = listPortfolio.filter(':visible').length;

        // с какого элемента и по какой элемент ( не включительно ) показать
        listPortfolio.slice(showing, showing + numToShow).fadeIn(600);

        // снова находим все элементы которые видимые
        let nowShowing = listPortfolio.filter(':visible').length;

        // если видимых элементов больше или равно всему количеству элементов.
        if (nowShowing >= numInList) {

          // скрываем блок показать еще
          buttonMore.parent().parent().hide();
        }
      });

      //= modal.js
    }

  })
  .catch(err => {

    // если есть ошибка
    console.warn(err);

  });

/* отрисовывает пост */
function renderPost(post, options = {}) {

  // путь до картинок
  const [webpImgAll,webpImgAllx2,webpImgAllx3,webpImgXl,webpImgXlx2,webpImgXlx3] = post.img.webp
  const [pngImgAll,pngImgAllx2,pngImgAllx3,pngImgXl,pngImgXlx2,pngImgXlx3] = post.img.png

  // Шаблон
  return `
    <li class="portfolio__item portfolio__item--hide" data-tabs="${post.category.toLowerCase()}">
      <article class="card">
        <header class="card__header">
          <h2 class="visually-hidden">${post.p_name}</h2>
          <div class="card__images">
            <picture>
              <source media="(min-width: 1200px)" srcset="${webpImgXl}, ${webpImgXlx2} 2x, ${webpImgXlx3} 3x" type="image/webp"/>
              <source media="(min-width: 1200px)" srcset="${pngImgXl}, ${pngImgXlx2} 2x, ${pngImgXlx3} 3x" type="image/png"/>
              <source media="(max-width: 1199px)" srcset="${webpImgAll}, ${webpImgAllx2} 2x, ${webpImgAllx3} 3x" type="image/webp"/>
              <img class="card__img" src="${pngImgAll}" srcset="${pngImgAllx2} 2x, ${pngImgAllx3} 3x" loading="lazy" alt=""/>
            </picture>
            <div class="card__category">${post.category}</div>
          </div>
        </header>
        <footer class="card__footer">
          <a class="card__link" href="${post.p_link}" target="_blank">На сайт</a>
          <a class="card__link js-card__link" href="#" data-id="${post.id_project}">Подробнее</a>
        </footer>
      </article>
    </li>
  `
}


