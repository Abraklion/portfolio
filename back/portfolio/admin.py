from django.contrib import admin
from django.forms import ModelForm
from django.utils.safestring import mark_safe
from .models import *


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id','project_name', 'get_html_photo')
    # list_display_links = ('id', 'title')
    # search_fields = ('title', 'content')
    # list_editable = ('is_published',)
    # list_filter = ('is_published', 'time_create')
    # prepopulated_fields = {"slug": ('title',)}
    # fields = '__all__'
    fields = (
    'p_name', 'p_organization', 'id_category', 'id_view', 'p_description', 'p_i_did', 'p_img', 'preview', 'p_link', 'p_git', 'skills', 'id_teamlist', 'p_sorting', 'p_status')
    readonly_fields = ('preview',)

    # save_on_top = True

    def get_html_photo(self, object):
        if object.p_img:
            return mark_safe(f"<img src='{object.p_img.url}' width=60>")

    def preview(self, object):
        if object.p_img:
            return mark_safe(f"<img src='{object.p_img.url}' width=250>")

    def project_name(self,object):
        if object.p_name:
            return mark_safe(f"<h3 style='color:000'>{object.p_name}</h3>")

    get_html_photo.short_description = 'Миниатюра'

    class Meta:
        model = Project

class SkillsAdminForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['s_img'].help_text = mark_safe(
            '<span style ="color:red;font-size: 14px;">Загружайте изображение в формате svg</span>')


class SkillsAdmin(admin.ModelAdmin):
    form = SkillsAdminForm


admin.site.register(Category)
admin.site.register(Project, ProjectAdmin)
admin.site.register(View)
admin.site.register(Skills,SkillsAdmin)
admin.site.register(Team)
admin.site.register(CatSkill)
