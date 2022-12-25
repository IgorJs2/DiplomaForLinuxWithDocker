from django.urls import path
from rest_framework import routers

from api.views import RegionViewSet, CategoryViewSet, UserViewSet, CategoryByRegionViewSet, CurrentUser

router = routers.DefaultRouter()


router.register(r'user', UserViewSet, basename='users')
router.register(r'region', RegionViewSet, basename='regions')
router.register(r'category', CategoryViewSet, basename='categories')
router.register(r'categoryByRegion', CategoryByRegionViewSet, basename='categoryByRegion')

urlpatterns = [
    path('current_user/', CurrentUser.as_view()),
]

urlpatterns += router.urls
