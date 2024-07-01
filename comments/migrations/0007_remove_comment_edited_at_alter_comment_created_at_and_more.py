# Generated by Django 5.0.6 on 2024-06-28 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("comments", "0006_comment_edit_history"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="comment",
            name="edited_at",
        ),
        migrations.AlterField(
            model_name="comment",
            name="edit_history",
            field=models.JSONField(null=True),
        ),
    ]