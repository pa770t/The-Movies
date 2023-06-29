from rest_framework import serializers
from rest_framework.fields import FileField
from .models import *
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}, 'is_staff': {'read_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.set_password(validated_data['password'])
        user.save()
        Token.objects.create(user=user)
        return user

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = '__all__'

class WriterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Writer
        fields = '__all__'

class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    genre = GenreSerializer(many=True)
    director = DirectorSerializer(many=True)
    writer = WriterSerializer(many=True)
    actors = ActorSerializer(many=True)
    poster = FileField(write_only=True)
    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'genre',
            'director',
            'writer',
            'actors',
            'released',
            'runtime',
            'imdb_rating',
            'awards',
            'poster',
            'trailer',
            'now_showing',
            'get_poster_url',
            'get_trailer_url',
            'synopsis',
            'created_at',
        ]

    def create(self, validated_data):
        genres = validated_data.pop('genre')
        directors = validated_data.pop('director')
        writers = validated_data.pop('writer')
        actors = validated_data.pop('actors')
        movie = Movie.objects.create(**validated_data)
        genre_instances = [Genre.objects.get(name=genre['name']).pk for genre in genres]
        director_instances = [Director.objects.get(first_name=director['first_name'], last_name=director['last_name']).pk for director in directors]
        writer_instances = [Writer.objects.get(first_name=writer['first_name'], last_name=writer['last_name']).pk for writer in writers]
        actor_instances = [Actor.objects.get(first_name=actor['first_name'], last_name=actor['last_name']).pk for actor in actors]

        movie.genre.set(genre_instances)
        movie.director.set(director_instances)
        movie.writer.set(writer_instances)
        movie.actors.set(actor_instances)

        return movie
    
    def update(self, instance, validated_data):
        genres = validated_data.pop('genre')
        genre_instances = [Genre.objects.get(name=genre['name']).pk for genre in genres]
        instance.genre.set(genre_instances)
        return super().update(instance, validated_data)
