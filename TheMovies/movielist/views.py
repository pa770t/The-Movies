from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from .serializers import MovieSerializer, GenreSerializer, DirectorSerializer, WriterSerializer, ActorSerializer, UserSerializer
from .models import *
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework.pagination import PageNumberPagination
from rest_framework.authtoken.models import Token

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movielist(request):
    movies = Movie.objects.all()
    if request.query_params.get('now-showing'):
        movies = Movie.objects.filter(now_showing=True).order_by('-released')
    if request.query_params.get('latest-movies'):
        movies = Movie.objects.order_by('-released')
    if request.query_params.get('top-rated'):
        movies = Movie.objects.order_by('-imdb_rating')
    if request.query_params.get('s'):
        s = request.query_params.get('s')
        movies = Movie.objects.filter(Q(title__icontains=s) | Q(actors__first_name__icontains=s) | Q(actors__last_name__icontains=s)).distinct()
    
    paginator = PageNumberPagination()
    paginator.page_size = 6
    result_page = paginator.paginate_queryset(movies, request)
    serialized_data = MovieSerializer(result_page, many=True)
    return paginator.get_paginated_response(serialized_data.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_movie(request):
    import base64
    from django.core.files.base import ContentFile
    if request.data.get('poster'):
        format, imgstr = request.data.get('poster').split(';base64')
        ext = format.split('/')[-1]
        request.data['poster'] = ContentFile(base64.b64decode(imgstr), name=request.data.get('title') + '.' + ext)
    
    if request.data.get('trailer'):
        format_trailer, trailer_str = request.data.get('trailer').split(';base64')
        ext = format_trailer.split('/')[-1]
        request.data['trailer'] = ContentFile(base64.b64decode(trailer_str), name=request.data.get('title') + '_trailer.' + ext)

    serialized_data = MovieSerializer(data=request.data)
    
    if serialized_data.is_valid():
        serialized_data.save()
        return Response(serialized_data.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def singleMovie(request, title):
    movie = get_object_or_404(Movie, title=title)
    if request.method == 'GET':
        serialised_data = MovieSerializer(movie)
        return Response(serialised_data.data)
    if request.method == 'DELETE':
        deleted_data = movie.delete()
        return Response(deleted_data)
    if request.method == 'PATCH':
        serialised_data = MovieSerializer(instance=movie, data=request.data, partial=True)
        if serialised_data.is_valid():
            serialised_data.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'smth went wrong'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
def editSingleMovie(request, id):
    movie = get_object_or_404(Movie, id=id)
    if request.method == 'DELETE':
        deleted_data = movie.delete()
        return Response(deleted_data)
    if request.method == 'PATCH':
        serialised_data = MovieSerializer(instance=movie, data=request.data, partial=True)
        if serialised_data.is_valid():
            serialised_data.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'smth went wrong'}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def genrelist(request):
    genres = Genre.objects.all()
    serialized_data = GenreSerializer(genres, many=True)
    return Response(serialized_data.data)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def directorlist(request):
    directors = Director.objects.all()
    if request.query_params.get('s'):
        s = request.query_params.get('s')
        try:
            directors = Director.objects.filter(Q(first_name__icontains=s) | Q(last_name__icontains=s) | Q(first_name__icontains=s.split(' ')[0]) & Q(last_name__istartswith=s.split(' ')[1]))
        except:
            directors = Director.objects.filter(Q(first_name__icontains=s) | Q(last_name__icontains=s))
    serialized_data = DirectorSerializer(directors, many=True)
    return Response(serialized_data.data)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def writerlist(request):
    writers = Writer.objects.all()
    if request.query_params.get('s'):
        s = request.query_params.get('s')
        try:
            writers = Writer.objects.filter(Q(first_name__icontains=s) | Q(last_name__icontains=s) | Q(first_name__icontains=s.split(' ')[0]) & Q(last_name__istartswith=s.split(' ')[1]))
        except:
            writers = Writer.objects.filter(Q(first_name__icontains=s) | Q(last_name__icontains=s))
    serialized_data = WriterSerializer(writers, many=True)
    return Response(serialized_data.data)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def actorlist(request):
    actors = Actor.objects.all()
    if request.query_params.get('s'):
        s = request.query_params.get('s')
        try:
            actors = Actor.objects.filter(Q(first_name__icontains=s) | Q(last_name__icontains=s) | Q(first_name__icontains=s.split(' ')[0]) & Q(last_name__istartswith=s.split(' ')[1]))
        except:
            actors = Actor.objects.filter(Q(first_name__icontains=s) | Q(last_name__icontains=s))
    serialized_data = ActorSerializer(actors, many=True)
    return Response(serialized_data.data)

@api_view(['POST'])
def user_create(request):
    serialized_data = UserSerializer(data=request.data)
    if serialized_data.is_valid():
        serialized_data.save()
        user = User.objects.get(username=serialized_data.data['username'])
        token = Token.objects.get(user=user)
        return Response({'token': str(token)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    try:
        user = User.objects.get(username=request.user)
        serialized_data = UserSerializer(instance=user)
        return Response(serialized_data.data)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_genre(request):
    serialized_data = GenreSerializer(data=request.data)
    if serialized_data.is_valid():
        serialized_data.save()
        return Response(serialized_data.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'This genre already exists!'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_director(request):
    serialized_data = DirectorSerializer(data=request.data)
    if serialized_data.is_valid():
        serialized_data.save()
        return Response(serialized_data.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'This director already exists!'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_writer(request):
    serialized_data = WriterSerializer(data=request.data)
    if serialized_data.is_valid():
        serialized_data.save()
        return Response(serialized_data.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'This writer already exists!'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_actor(request):
    serialized_data = ActorSerializer(data=request.data)
    if serialized_data.is_valid():
        serialized_data.save()
        return Response(serialized_data.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'This actor already exists!'}, status=status.HTTP_400_BAD_REQUEST)
