from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, \
    DestroyModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.shortcuts import redirect
from api.models import Region, Category
from api.serializers import RegionSerializer, CategorySerializer, UserSerializer

class UserViewSet(GenericViewSet, CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin,
                  DestroyModelMixin):
    """
        User vies set
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RegionViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    """
        Region vies set
    """
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class CategoryViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin,
                      GenericViewSet):
    """
        Category view  set
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = (JWTAuthentication,)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        categories = Category.objects.filter(region_id=instance.region_id)
        if len(categories) == 1:
            region = Region.objects.get(id=instance.region_id)
            region.accepted = False
            region.save()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


class CategoryByRegionViewSet(GenericViewSet, ListModelMixin):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    authentication_classes = (JWTAuthentication,)

    def get_queryset(self):
        region_id = self.request.query_params.get('region_id')
        return Category.objects.filter(region_id=region_id)


class CurrentUser(APIView):
    """
        Get current user
    """

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
