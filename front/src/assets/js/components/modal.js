/* ================================================================================ */
/* ============================= МОДАЛЬНОЕ ОКНО =================================== */
/* ================================================================================ */

let focusTrigger;

// показываем модальное окно
$(".js-card__link").on("click",function (e){

  e.preventDefault();

  setTimeout(()=>{
    $("body").addClass("body-overflow");
  },400)

  $(".modal").addClass("modal--active");

  $("a:not(.menu__link,.header__logo,.modal__link,.modal__team-link), button:not(.button__modal), input, textarea, .skills__slider-bar:not(.slider-bar--off)").attr("tabindex","-1");

  focusTrigger = this;

  // погрузчик
  $('.modal')
    .find('.container')
    .prepend('<div class="loader loader--center"></div>');

  // отпрвляем fetch запрос на сервер и выводим подробнно проект
  fetch(`${config.requestAllProject}${this.dataset.id}`,{method: 'get'})
    .then(res => {

      // обрабатываем ответ от сервера
      if (res.ok) {

        // возвращаем json
        return res.json();

      }

      throw new Error("Сервер ответил ошибкой на запрос: вывести проект подробно");

    })
    .then(data => {

      // отрабатываем данные пришедшие от сервера
      const html = renderFullPost(data)

      // удаляем погрузчик
      $('.modal')
        .find('.loader')
        .remove();

      // добавляем категории на страницу
      $('.modal__inner')
        .prepend(html)

    })
    .catch(err => {

      // если есть ошибка
      console.warn(err);

    });
});

// скрываем модальное окно
$(".button__modal").on("click",function (e){

  e.preventDefault();

  $("body").removeClass("body-overflow");
  $(".modal").removeClass("modal--active");

  $(".modal__title,.modal__box,.modal__info").fadeOut(200, function (){
    $(".modal__title,.modal__box,.modal__info").remove();
  });

  $("a:not(.menu__link,.header__logo,.modal__link,.modal__team-link), button:not(.button__modal), input, textarea, .skills__slider-bar:not(.slider-bar--off)").attr("tabindex","0");

  focusTrigger.focus();
});


/* отрисовывает пост подробно */
function renderFullPost(fullPost, options = {}) {

  // путь до картинок
  const [webpImgAll,webpImgAllx2,webpImgAllx3,webpImgXl,webpImgXlx2,webpImgXlx3] = fullPost.img.webp
  const [pngImgAll,pngImgAllx2,pngImgAllx3,pngImgXl,pngImgXlx2,pngImgXlx3] = fullPost.img.png

  // организация
  const organization = fullPost.p_organization.trim() ?
    `<li class="modal__item modal__item--company" title="Заказчик">${fullPost.p_organization}</li>` :
    ''

  // ссылка на репозиторий
  const projectGit = fullPost.p_git.trim() ?
    `<li class="modal__item modal__item--github">
       <a class="modal__link" href="${fullPost.p_git}" target="_blank">Ссылка на репозиторий</a>
    </li` :
    ''

  // список навыков
  const skills = fullPost.skills.map(skill => {

    return `<li class="modal__technology-item">${skill}</li>`

  })

  // список команды
  const teams = fullPost.team_link.map(team => {

    return `
      <li class="modal__team-item">
        <a class="modal__team-link" href="${team.b_link}" target="_blank">${team.b_name} (${team.b_post})</a>
      </li>
    `

  })

  // проверяем если ли команда
  const teamList = fullPost.team_link.length !== 0 ?
    `
      <li class="modal__info-list">
        <div class="modal__info-subtitle">Принимали участие:</div>
        <ul class="modal__team">
          ${ teams.join(' ') }
        </ul>
      </li>
    ` :
    ''

  // Шаблон
  return `
    <div class="modal__title">${fullPost.p_name}</div>
    <div class="modal__box">
      <div class="modal__img">
        <picture>
          <source media="(min-width: 768px) and (max-width: 991px)" srcset="${webpImgXl}, ${webpImgXlx2} 2x, ${webpImgXlx3} 3x" type="image/webp">
          <source media="(min-width: 768px) and (max-width: 991px)" srcset="${pngImgXl}, ${pngImgXlx2} 2x, ${pngImgXlx3} 3x" type="image/png">
          <source media="(max-width: 767px), (min-width: 992px)" srcset="${webpImgAll}, ${webpImgAllx2} 2x, ${webpImgAllx3} 3x" type="image/webp">
          <img src="${pngImgAll}" srcset="${pngImgAllx2} 2x, ${pngImgAllx3} 3x" loading="lazy" alt="">
        </picture>
      </div>
      <ul class="modal__list">
        ${organization}
        <li class="modal__item modal__item--type" title="Тип сайта">${fullPost.view}</li>
        <li class="modal__item modal__item--internet">
          <a class="modal__link" href="${fullPost.p_link}" target="_blank">Ссылка на проект</a>
        </li>
        ${projectGit}
      </ul>
    </div>
    <ul class="modal__info">
      <li class="modal__info-list">
        <div class="modal__info-subtitle">Кратко о проекте:</div>
        <p class="modal__info-text">${fullPost.p_description}</p>
      </li>
      <li class="modal__info-list">
        <div class="modal__info-subtitle">Что было сделано мной:</div>
        <p class="modal__info-text">${fullPost.p_i_did}</p>
      </li>
      <li class="modal__info-list modal__info-list--mb">
        <div class="modal__info-subtitle">Использовал Технологии:</div>
        <ul class="modal__technology">
          ${ skills.join(' ') }
        </ul>
      </li>
      ${teamList}
    </ul>
  `
}


