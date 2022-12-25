from django.db import models


class Region(models.Model):
    name = models.CharField(max_length=60, null=False, blank=False)
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=300)
    url = models.URLField(max_length=1000, null=True, blank=True)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'
