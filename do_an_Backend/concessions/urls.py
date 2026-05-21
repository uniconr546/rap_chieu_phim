from django.urls import path

from .views import *

urlpatterns=[

 path(
    '',
    concession_list
 ),

 path(
    'create/',
    concession_create
 ),

 path(
    '<int:pk>/delete/',
    concession_delete
 )

]