# Generated by Django 5.0.6 on 2024-06-11 19:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0001_initial"),
        ("questions", "0009_groupofquestions_conditional_question_group"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="conditional",
            field=models.OneToOneField(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="post",
                to="questions.conditional",
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="group_of_questions",
            field=models.OneToOneField(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="post",
                to="questions.groupofquestions",
            ),
        ),
        migrations.AlterField(
            model_name="post",
            name="question",
            field=models.OneToOneField(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="post",
                to="questions.question",
            ),
        ),
    ]
