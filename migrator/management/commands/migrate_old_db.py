from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection

from migrator.services.migrate_comments import migrate_comments
from migrator.services.migrate_forecasts import migrate_forecasts
from migrator.services.migrate_leaderboards import (
    create_global_leaderboards,
    populate_global_leaderboards,
    populate_project_leaderboards,
)
from migrator.services.migrate_permissions import migrate_permissions
from migrator.services.migrate_projects import migrate_projects
from migrator.services.migrate_questions import migrate_questions
from migrator.services.migrate_scoring import score_questions
from migrator.services.migrate_users import migrate_users
from migrator.services.migrate_votes import migrate_votes
from migrator.services.post_migrate import post_migrate_calculate_divergence
from migrator.utils import reset_sequence, paginated_query
from posts.tasks import run_compute_movement
from projects.models import Project
from projects.permissions import ObjectPermission
from scoring.models import populate_medal_exclusion_records


class Command(BaseCommand):
    help = """
    Migrates old database data to the new one
    """

    def add_arguments(self, parser):
        parser.add_argument(
            "site_ids",
            type=str,
            nargs="?",
            default="1",
            help="Comma-separated list of site IDs",
        )

    def handle(self, *args, site_ids=None, **options):
        site_ids = [int(x) for x in site_ids.split(",")]
        '''
        with connection.cursor() as cursor:
            cursor.execute("DROP SCHEMA public CASCADE;")
            cursor.execute("CREATE SCHEMA public;")
        call_command("makemigrations")
        call_command("migrate")

        Project.objects.get_or_create(
            type=Project.ProjectTypes.SITE_MAIN,
            defaults={
                "name": "Metaculus Community",
                "type": Project.ProjectTypes.SITE_MAIN,
                "default_permission": ObjectPermission.FORECASTER,
            },
        )

        migrate_users()
        print("Migrated users")
        migrate_questions(site_ids=site_ids)
        print("Migrated questions")
        migrate_forecasts()
        print("Migrated forecasts")
        migrate_projects(site_ids=site_ids)
        print("Migrated projects")
        migrate_votes()
        print("Migrated votes")
        migrate_comments()
        print("Migrated comments")
        migrate_permissions()
        print("Migrated permissions")
        '''
        # scoring
        score_questions()
        print("Scored questions")
        populate_medal_exclusion_records()
        print("Populated medal exclusion records")
        create_global_leaderboards()
        print("Created global leaderboards")
        populate_global_leaderboards()
        print("Populated global leaderboards")
        populate_project_leaderboards()
        print("Populated project leaderboards")

        print("Running post-migrate commands")
        post_migrate_calculate_divergence()
        run_compute_movement()

        # Reset sql sequences
        reset_sequence()
