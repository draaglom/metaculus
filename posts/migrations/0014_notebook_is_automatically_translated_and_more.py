# Generated by Django 5.1.4 on 2025-03-06 10:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0013_alter_post_hotness"),
    ]

    operations = [
        migrations.AddField(
            model_name="notebook",
            name="is_automatically_translated",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="post",
            name="is_automatically_translated",
            field=models.BooleanField(default=True),
        ),
    ]
