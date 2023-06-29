from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Director)
admin.site.register(Writer)
admin.site.register(Actor)
admin.site.register(Genre)
# admin.site.register(Trailer)
admin.site.register(Movie)
