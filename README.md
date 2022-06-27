# Сайт Портфолио

### FrontEnd 

***

*FrontEnd использует технологии GULP | PUG | SCSS | JS | jQuery*

Все что связано с фронтендом находится в папки FrontEnd в корне проекта Portfolio.

**Конфигурация для сборки:**

> NODE: v 14.15.5

> NPM: v 6.14.11

### BackEnd 

***

*BackEnd использует технологии Python | Django | Django REST framework*

Все что связано с бэкендом находится в папки BackEnd в корне проекта Portfolio.

**Конфигурация для сборки:**

> PYTHON: v 3.8.2

> PIP: v 20.0.2

### Веб-сервер

***

**Nginx** - находится в корне проекта папка с названием ***nginx***

### Первый запуск

***

*Сборка использует технологию Docker*

Перед тем как перейти к сборки настройте [*переменные окружения*](#переменные-окружения)

Есть две конфигурации сборки проекта development и production.

>**Сборка в режиме Production:**
> 
>*Production - используется для сборки оптимизированого готового продукта, подходит запуска на сервере*
>1. Запускает контейнер:
> ```
> docker compose -f docker-compose.prod.yml up -d --build
> ```
>2. Указываем где брать миграции (нужно только для первого запуска):
> ```
> docker compose -f docker-compose.prod.yml exec back python manage.py makemigrations portfolio --noinput
> ```
>3. Делаем миграции (нужно только для первого запуска):
> ```
> docker compose -f docker-compose.prod.yml exec back python manage.py migrate --noinput
> ```
>4. Вытаскиваем стили админки (нужно только для первого запуска):
> ```
> docker compose -f docker-compose.prod.yml exec back python manage.py collectstatic --no-input --clear
> ```
>5. Создает суперюзера для админки (нужно только для первого запуска):
> ```
> docker compose -f docker-compose.prod.yml exec back python manage.py createsuperuserr
> ```
>6. Останавливаем контейнер:
> ```
> docker compose -f docker-compose.prod.yml down
> ```
> - *если остановить  с флагом **-v** (вы потеряите данные из БД и т.д) удаляться все вольюмы и при следующим запуске вам нужно будет опять вводить с 2 по 5 команды*
> ```
> docker compose -f docker-compose.prod.yml down -v
> ```

***

>**Сборка в режиме Development:**
> 
>*Development - используется для разработки, здесь вы можете вносить изменения с проект*
>1. Запускает контейнер:
>```
>docker compose up --build 
>```
>2. Создает суперюзера для админки (нужно только для первого запуска):
>```
>docker compose exec back python manage.py createsuperuse
>```
>3. Останавливаем контейнер:
>```
>docker compose down
>```
>- *если остановить  с флагом **-v** (вы потеряите данные из БД) удаляться все вольюмы и при следующим запуске вам нужно будет опять создавать суперюзера командой номер два*
>```
>docker compose down -v
>```

### Переменные окружения

***

**Переменные окружения для Production**

>**.env.prod.db.example** - настройки базы данных (после того как закончите редактировать удалите *.example* из названия файл)
>
>**.env.prod.example** - настройки django (после того как закончите редактировать удалите .example из названия файла)

**Переменные окружения для Development**
>**.env.dev.db.example** - настройки базы данных (после того как закончите редактировать удалите *.example* из названия файла)
>
>**.env.dev.example** - настройки django (после того как закончите редактировать удалите .example из названия файла)

**Общие**
> зайдите в папку **front**, найдите файл **.env.example** - настройки для gulp (после того как закончите редактировать удалите *.example* из названия файла)
