# Generated by Django 5.0.6 on 2024-06-21 09:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0009_alter_projectuserpermission_permission"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="project",
            name="is_public",
        ),
        migrations.AlterField(
            model_name="project",
            name="type",
            field=models.CharField(
                choices=[
                    ("site_main", "Site Main"),
                    ("tournament", "Tournament"),
                    ("question_series", "Question Series"),
                    ("personal_project", "Personal Project"),
                    ("category", "Category"),
                    ("tag", "Tag"),
                    ("topic", "Topic"),
                ],
                db_index=True,
                max_length=32,
            ),
        ),
    ]