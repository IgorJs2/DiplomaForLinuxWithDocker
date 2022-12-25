# Generated by Django 4.0.3 on 2022-05-10 17:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='complaint_info',
        ),
        migrations.RemoveField(
            model_name='category',
            name='events_info',
        ),
        migrations.RemoveField(
            model_name='category',
            name='program',
        ),
        migrations.RemoveField(
            model_name='category',
            name='responsible_officials',
        ),
        migrations.AddField(
            model_name='category',
            name='name',
            field=models.CharField(default=1, max_length=150),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='category',
            name='url',
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='region',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.region'),
        ),
    ]