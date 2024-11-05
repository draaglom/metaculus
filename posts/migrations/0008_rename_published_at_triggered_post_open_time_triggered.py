# Generated by Django 5.1.1 on 2024-11-04 17:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("posts", "0007_post_open_time_alter_post_actual_close_time_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="published_at_triggered",
            field=models.BooleanField(db_index=True, default=False, editable=False),
        ),
        migrations.RenameField(
            model_name="post",
            old_name="published_at_triggered",
            new_name="open_time_triggered",
        ),
    ]