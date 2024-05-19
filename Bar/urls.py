"""hxh URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views

app_name = 'bar'
urlpatterns = [
    path('ping', views.ping, name='ping'),
    path('ping/<int:score>', views.pingScore, name="pingScore"),
    path('guitarGame', views.guitarGame, name="guitarGame"),
    path('guitarScore/<int:score>', views.addScore, name="addScore"),
    #Links for the head popper game
    path('headPopper', views.headPopper, name='headPopper'),
    path('headPopper/<int:score>', views.headPopperScore, name='headPopper'),
    path('board', views.board, name='board'),
    path('loginPage', views.loginPage, name="loginPage"),
    path('checkLogin', views.checkLogin, name="checkLogin"),
    path('', views.main, name='main'),
    path('<int:intro>', views.main, name='main2'),
]
