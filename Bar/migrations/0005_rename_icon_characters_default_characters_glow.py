# Generated by Django 5.0.1 on 2024-05-07 19:40

import Bar.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Bar', '0004_characters'),
    ]

    operations = [
        migrations.RenameField(
            model_name='characters',
            old_name='icon',
            new_name='default',
        ),
        migrations.AddField(
            model_name='characters',
            name='glow',
            field=models.FilePathField(blank=True, default=None, null=True, path=Bar.models.sprite_path),
        ),
    ]
