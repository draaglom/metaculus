# Generated by Django 5.0.6 on 2024-06-06 20:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0003_user_username_change_date"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="username_change_date",
        ),
        migrations.AddField(
            model_name="user",
            name="old_usernames",
            field=models.JSONField(default=list),
        ),
    ]