from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('movielist/', views.movielist, name='movielist'),
    path('movie/<title>', views.singleMovie, name='singleMovie'),
    path('movie/edit/<id>', views.editSingleMovie, name='editSingleMovie'),
    path('create-movie/', views.create_movie, name='create_movie'),
    path('genrelist/', views.genrelist, name='genrelist'),
    path('directorlist/', views.directorlist, name='directorlist'),
    path('writerlist/', views.writerlist, name='writerlist'),
    path('actorlist/', views.actorlist, name='actorlist'),

    # token
    path('token/create/', obtain_auth_token, name='obtain_auth_token'),

    # users
    path('user/create/', views.user_create, name='create_user'),
    path('userinfo/', views.get_user_info, name='userinfo'),

    path('genre/create/', views.create_genre, name='create_genre'),
    path('director/create/', views.create_director, name='create_director'),
    path('writer/create/', views.create_writer, name='create_writer'),
    path('actor/create/', views.create_actor, name='create_actor'),
]
