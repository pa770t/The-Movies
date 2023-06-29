from django.db import models

# Create your models here.

class Director(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class Writer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class Actor(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class Genre(models.Model):
    name = models.CharField(max_length=40)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=100, unique=True)
    genre = models.ManyToManyField(Genre, blank=True)
    director = models.ManyToManyField(Director, blank=True)
    writer = models.ManyToManyField(Writer, blank=True)
    actors = models.ManyToManyField(Actor, blank=True)
    released = models.DateField(null=True, blank=True)
    runtime = models.IntegerField()
    imdb_rating = models.DecimalField(max_digits=2, decimal_places=1)
    awards = models.CharField(max_length=255)
    poster = models.ImageField(upload_to='images/poster', null=True, blank=True)
    trailer = models.FileField(upload_to='trailers', null=True, blank=True)
    synopsis = models.TextField()
    now_showing = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_poster_url(self):
        if self.poster:
            return 'http://127.0.0.1:8000' + self.poster.url
        return ''
    
    def get_trailer_url(self):
        if self.trailer:
            return 'http://127.0.0.1:8000' + self.trailer.url
        return ''

    def __str__(self):
        return self.title
