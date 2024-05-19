from django.shortcuts import render

from django.shortcuts import render, redirect

from django.contrib.auth import authenticate, login

from django.contrib.auth.models import User

from django.http import HttpResponse

# Create your views here.
from .models import *




# Create your views here.

def loginPage(request):
    context = {
        
    }
    return render(request, 'login.html', context)

def checkLogin(request):
    user = authenticate(request, username=request.POST["username"], password="KillYoureself")
    print(user)
    if user is not None:
        login(request, user)
    else:
        newUser = User.objects.create_user(request.POST["username"], "", "KillYoureself")
        newUser.save()
        login(request, newUser)

    return redirect( "bar:main")


def main(request, intro = 1):
    context =  {
        'intro': intro,
        'characters': Characters.objects.all(),
    }
    return render(request,'bar.html', context)

def ping(request):
    return render(request,'ping.html', {})

def pingScore(request, score):
    try:
        ping = request.user.ping
    except Ping.DoesNotExist:
        ping = Ping(user=request.user, score=0)

    if score > ping.score:
        ping.score = score

    ping.save()

    return redirect("bar:main2", intro = 0)

def board(request):
    context = {
        "ping_scores":Ping.objects.all().order_by('-score')[0: 10],
        "guitarScore":GuitarGameScores.objects.all().order_by('-score')[0: 10],
        "headPopperScore":HeadPopper.objects.all().order_by('-score')[0: 10]
    }
    return render(request,'board.html', context)

def guitarGame(request):
    return render(request, "guitarGame.html", {})


def addScore(request, score):
    
    try:
        guitargamescores = request.user.guitargamescores
    except GuitarGameScores.DoesNotExist:
        guitargamescores = GuitarGameScores(user=request.user, score=0)

    if score > guitargamescores.score:
        guitargamescores.score = score

    guitargamescores.save()
    
    return redirect("bar:main2", intro = 0)

# Head popper game view
def headPopper(request):
    return render(request,'headPopper.html', {})

# Head popper game score save link
def headPopperScore(request, score):
    try:
        headPopper = request.user.headpopper
    except HeadPopper.DoesNotExist:
        headPopper = HeadPopper(user=request.user, score=0)

    if score > headPopper.score:
        headPopper.score = score

    headPopper.save()
    
    return redirect("bar:main")
