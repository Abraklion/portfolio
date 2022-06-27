from django.forms import model_to_dict
from rest_framework import serializers
from .models import *
from operator import itemgetter
from collections import OrderedDict


class CatSkillSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='cs_name')
    skill = serializers.SerializerMethodField(method_name='get_skills')

    class Meta:
        model = CatSkill
        fields = ['category', 'skill']

    def get_skills(self, instance):
        request = self.context.get('request')
        skilli = []
        for i in instance.skills.all().filter(s_status=True):
            skills = {}
            skills['id_skill'] = i.pk
            skills['s_name'] = i.s_name
            skills['s_description'] = i.s_description
            if i.s_img:
                s_img = i.s_img.url[i.s_img.url.find('/')+1:len(i.s_img.url)]
                skills['s_img'] = str(s_img)
            else:
                skills['s_img'] = None
            skills['s_quantity'] = i.s_quantity
            skills['s_level'] = i.s_level
            skills['s_sorting'] = i.s_sorting
            skilli.append(skills)
            # skilli.sort(key=lambda x: x.id_skill)
            skilli = sorted(skilli, key=itemgetter('s_sorting'), reverse=False)


        return skilli


class ProjectSerializer(serializers.ModelSerializer):
    img = serializers.SerializerMethodField(method_name='get_image')
    category = serializers.CharField(source='id_category')
    id_project = serializers.CharField(source='pk')

    class Meta:
        model = Project
        fields = ['id_project', 'category', 'p_name', 'p_link', 'img']


    def get_image(self, instance):
        order_keys = ['-preview', '-preview@2x', '-preview@3x', '-preview-xl', '-preview-xl@2x', '-preview-xl@3x']
        request = self.context.get('request')
        webp_list = []
        if type(instance.p_img_preview_webp) is dict:
            sorted_dict = dict(OrderedDict([(el, instance.p_img_preview_webp[el]) for el in order_keys]))
            for i in sorted_dict.values():
                if '\\' in i:
                    my_str = str(i).replace('\\', '/')
                    webp_list.append(my_str)
                else:
                    webp_list.append(i)
        png_list = []
        if type(instance.p_img_preview_png) is dict:
            sorted_dict = dict(OrderedDict([(el, instance.p_img_preview_png[el]) for el in order_keys]))
            for i in sorted_dict.values():
                if '\\' in i:
                    my_str = str(i).replace('\\', '/')
                    png_list.append(my_str)
                else:
                    png_list.append(i)
        img = {}
        img['png'] = png_list
        img['webp'] = webp_list

        return img


class ProjectDet(serializers.ModelSerializer):
    skills = serializers.StringRelatedField(many=True)
    team_link = serializers.SerializerMethodField(method_name='get_team')
    view = serializers.CharField(source='id_view')
    img = serializers.SerializerMethodField(method_name='get_image')

    class Meta:
        model = Project
        fields = ['p_name', 'p_organization', 'view', 'p_link', 'p_git', 'img', 'p_description',
                  'p_i_did', 'team_link', 'skills']

    def get_team(self, instance):
        request = self.context.get('request')
        link_list = []
        for i in instance.id_teamlist.all():
            teama = {}
            teama['b_name'] = i.b_name
            teama['b_link'] = i.b_link
            teama['b_post'] = i.b_post

            link_list.append(teama)

        return link_list

    def get_image(self, instance):
        order_keys = ['', '@2x', '@3x', '-xl', '-xl@2x', '-xl@3x']
        request = self.context.get('request')
        webp_list = []
        if type(instance.p_img_large_webp) is dict:
            sorted_dict = dict(OrderedDict([(el, instance.p_img_large_webp[el]) for el in order_keys]))
            for i in sorted_dict.values():

                if '\\' in i:
                    my_str = str(i).replace('\\', '/')
                    webp_list.append(my_str)
                else:
                    webp_list.append(i)
        png_list = []
        if type(instance.p_img_large_png) is dict:
            sorted_dict = dict(OrderedDict([(el, instance.p_img_large_png[el]) for el in order_keys]))
            for i in sorted_dict.values():
                if '\\' in i:
                    my_str = str(i).replace('\\', '/')
                    png_list.append(my_str)
                else:
                    png_list.append(i)
        img = {}
        img['png'] = png_list
        img['webp'] = webp_list
        return img
