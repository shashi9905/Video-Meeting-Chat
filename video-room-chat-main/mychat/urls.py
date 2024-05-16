from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns += staticfiles_urlpatterns()


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('videochat.urls')),  # Include the URLs from your app
]

