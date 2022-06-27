import tinify
from django.db import models
from django.urls import reverse
import os
from PIL import Image

API = 'yPnptfy8hjVP6f0Y0vC7mbdwT4hPZfJs'
tinify.key = 'yPnptfy8hjVP6f0Y0vC7mbdwT4hPZfJs'

preview_webp = [(400, 260, '-preview'), (800, 520, '-preview@2x'),
                (1200, 780, '-preview@3x'), (491, 325, '-preview-xl'),
                (982, 650, '-preview-xl@2x'), (1473, 975, '-preview-xl@3x')]

detailed_webp = [(516, 337, ''), (1032, 674, '@2x'),
                 (1548, 1011, '@3x'), (665, 434, '-xl'),
                 (1330, 868, '-xl@2x'), (1995, 1302, '-xl@3x')]

preview_png = [(400, 260, '-preview'), (800, 520, '-preview@2x'),
               (1200, 780, '-preview@3x'), (491, 325, '-preview-xl'),
               (982, 650, '-preview-xl@2x'), (1473, 975, '-preview-xl@3x')]

detailed_png = [(516, 337, ''), (1032, 674, '@2x'),
                (1548, 1011, '@3x'), (665, 434, '-xl'),
                (1330, 868, '-xl@2x'), (1995, 1302, '-xl@3x')]


class Project(models.Model):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__original_name = self.p_img

    """
    Функция ресайза для отдельного фото по ресайзу
    """

    def find_proprtion(self, instance, new_width, new_height, extension, name, *args,
                       **kwargs):  # Принимаем экземпляр модели(instance),ширину, высоту, разрешение,имя

        filename, file_extension = os.path.splitext(
            instance.path)  # Разбиваем абсолютный путь на имя файла и расширение

        try:
            clearname = filename[(filename.rfind('\\')) + 1:len(filename)]
        except:
            clearname = filename[filename.rfind('/'):len(filename)]
        name = clearname + name
        nw_name = os.path.join('media', 'resize', name)
        resize = os.path.join('media', 'resize')
        try:
            os.mkdir(os.path.abspath(resize))
        except:
            pass
        save_path = nw_name + '.' + (str(extension)).lower()  # Путь для сохранения ресайза фото + расширение
        image = Image.open(instance.path)  # Открываем фото с помощью библиотеки PIL
        relative_name = save_path[save_path.rfind('media'):len(
            save_path)]  # Обрезаем абсолютный путь до относительного, в папке media
        size = (new_width, new_height)  # Задаем новые ширину и высоту
        res_image = image.resize(size, Image.ANTIALIAS)  # Выполняем функцию ресайза от библиотеки PIL
        res_image.save(save_path, format=str(extension))  # Сохраняем ресайз фото по абсолютному пути
        try:
            source = tinify.from_file(save_path)
            source.to_file(save_path)
        except:
            pass
        return relative_name  # Возвращаем относительный путь

    def make_resize(self, photo, extension, resolution):
        gallery = {}  # Создаем словарь для JSON, в который будем передавать -preview@2x и тд из нашей коллекции в качестве ключа и относительный путь к каждому ресайзу в качестве значения
        for thumbnail in resolution:  # Перебираем переданную коллекцию в которой находятся дополнения для имени файла -preview@2x и тд, новая ширина и высота
            thumb = self.find_proprtion(photo, thumbnail[0], thumbnail[1], extension=extension,
                                        name=thumbnail[2])  # Производим ресайз для каждого фото, всего 6 ресайзов
            gallery[thumbnail[
                2]] = thumb  # Добавляем в словарь в качестве ключа дополнительное название файла и в качестве значения относительный путь к ресайзу
        return gallery

    p_name = models.CharField(max_length=255, verbose_name='Имя проекта')
    id_category = models.ForeignKey('Category', on_delete=models.CASCADE, verbose_name='Категория')
    id_view = models.ForeignKey('View', on_delete=models.CASCADE, verbose_name='Вид')
    id_teamlist = models.ManyToManyField('Team', blank=True, related_name='projects', verbose_name='Принимали участие')
    p_organization = models.CharField(max_length=350, verbose_name='Организация', default=None, blank=True)
    p_description = models.TextField(verbose_name='Кратко о проекте')
    p_i_did = models.TextField(verbose_name='Что было сделано мной')
    p_img = models.ImageField(verbose_name='Фото png 920x600')
    p_img_preview_png = models.JSONField(null=True, blank=True)
    p_img_preview_webp = models.JSONField(null=True, blank=True)
    p_img_large_png = models.JSONField(null=True, blank=True)
    p_img_large_webp = models.JSONField(null=True, blank=True)
    p_link = models.CharField(max_length=255, verbose_name='Ссылка на проект')
    skills = models.ManyToManyField('Skills', related_name='project', verbose_name='Использовал технологии')
    p_git = models.CharField(max_length=255, verbose_name='Ссылка на репозиторий', blank=True, default=None)
    p_sorting = models.IntegerField(verbose_name='Сортировка', default=0)
    p_status = models.BooleanField(verbose_name='Показать', default=True)

    """
    Функция ресайза изображения
    """

    def save(self, *args, **kwargs):
        # Проверяем наличие фото, если есть фото, то проверяем было ли оно уже в базе, если нет-то выполняем ресайз
        if self.p_img:
            if self.__original_name.name != self.p_img.name:
                super().save(*args, **kwargs)  # Если фото новое,то сохраняем только поле изображения
                webp_preview = self.make_resize(self.p_img, extension='webp',
                                                resolution=preview_webp)  # Выполняем ресайз формата webp для превью
                webp_detailed = self.make_resize(self.p_img, extension='webp',
                                                 resolution=detailed_webp)  # Выполняем ресайз формата webp детального
                png_preview = self.make_resize(self.p_img, extension='png',
                                               resolution=preview_png)  # Выполняем ресайз формата png для превью
                png_detailed = self.make_resize(self.p_img, extension='png',
                                                resolution=detailed_png)  # Выполняем ресайз формата png детального
                self.p_img_preview_webp = webp_preview  # Присваиваем значение функций ресайза полям в БД, которые являются JSON
                self.p_img_large_webp = webp_detailed
                self.p_img_preview_png = png_preview
                self.p_img_large_png = png_detailed
                super().save(*args, **kwargs)  # Соханяем полностью модель
                self.__original_name = self.p_img  # Присваиваем переменной __original_name значение нового фото, чтобы при повторной загрузке этого фото не происходил ресайз
            else:
                self.p_img = self.__original_name  # Присваиваем новому фото значение предыдущего фото,в случае если имена совпадают
                super().save(*args, **kwargs)  # Сохраняем модель
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return self.p_name

    def get_absolute_url(self):
        return reverse('project', kwargs={'pk': self.pk})

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = "Проекты"


class Team(models.Model):
    b_name = models.CharField(max_length=250, verbose_name='Имя')
    b_post = models.CharField(max_length=250, verbose_name='Специальность')
    b_link = models.CharField(max_length=250, verbose_name='Ссылка на Github')

    def __str__(self):
        return self.b_name

    class Meta:
        verbose_name = 'Программисты'
        verbose_name_plural = "Программисты"


class Category(models.Model):
    c_name = models.CharField(max_length=100, db_index=True, verbose_name='Имя категории')

    def __str__(self):
        return self.c_name

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'


class View(models.Model):
    v_name = models.CharField(max_length=150, db_index=True, verbose_name='Имя вида')

    def __str__(self):
        return self.v_name

    class Meta:
        verbose_name = 'Вид'
        verbose_name_plural = "Вид"


class Skills(models.Model):
    id_catSkil = models.ForeignKey('CatSkill', on_delete=models.CASCADE, verbose_name='Категория навыка',
                                   related_name='skills')
    s_name = models.CharField(max_length=250, db_index=True, verbose_name='Название')
    s_description = models.CharField(max_length=255, verbose_name='Описание')
    s_img = models.FileField(upload_to='skills', verbose_name='Иконка svg 123x123px')
    s_quantity = models.IntegerField(verbose_name='Использовал в проектах')
    s_level = models.IntegerField(verbose_name='Уровень владения')
    s_sorting = models.IntegerField(verbose_name='Сортировка')
    s_status = models.BooleanField(verbose_name='Показать', default=True)

    def __str__(self):
        return self.s_name

    class Meta:
        verbose_name = 'Навыки'
        verbose_name_plural = "Навыки"

    def get_absolute_url(self):
        return reverse('skill', kwargs={'pk': self.pk})


class CatSkill(models.Model):
    cs_name = models.CharField(max_length=255, db_index=True, verbose_name='Категория навыков')
    cs_sorting = models.IntegerField(default=0, verbose_name='Сортировка')

    def __str__(self):
        return self.cs_name

    class Meta:
        verbose_name = 'Категория навыков'
        verbose_name_plural = "Категории навыков"
