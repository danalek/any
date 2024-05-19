from django.db import models
from django.contrib.auth.models import User
import os
from django.conf import settings

# Create your models here.

class Ping(models.Model):
    score = models.IntegerField()
    user = models.OneToOneField(User, on_delete=models.CASCADE)

class GuitarGameScores(models.Model):
    score = models.IntegerField()
    user = models.OneToOneField(User, on_delete=models.CASCADE)

def sprite_path():
    return os.path.join(settings.MEDIA_ROOT, "characters")

class Characters(models.Model):
    name = models.CharField(max_length=500, blank=True, null=True)
    text = models.TextField(blank=True, null=True)

    default = models.FilePathField(path=sprite_path, default=None, null=True, blank=True)
    glow = models.FilePathField(path=sprite_path, default=None, null=True, blank=True)

    top = models.IntegerField(default = 0)
    left = models.IntegerField(default = 0)
    height = models.IntegerField(default = 0)

    def __str__(self):
        return self.name
    
    def defaultImage(self):
        return str(self.default)[str(self.default).index('\\media'):]
    
    def glowImage(self):
        return str(self.glow)[str(self.glow).index('\\media'):]
    
# Head popper game scores table
# Do not forget to run "makemigrations" and "migrate"
class HeadPopper(models.Model):
    score = models.IntegerField()
    user = models.OneToOneField(User, on_delete=models.CASCADE)