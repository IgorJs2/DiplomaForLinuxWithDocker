from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Region, Category


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

    def create(self, validated_data):
        if 'url' in validated_data:
            region = Region.objects.get(name=validated_data['region'])
            if not region.accepted:
                region.accepted = True
                region.save()
        return super().create(validated_data)


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'