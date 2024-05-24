from django.core.management.base import BaseCommand

from migrator.services.migrate_users import migrate_users
from migrator.services.migrate_questions import migrate_questions


class Command(BaseCommand):
    help = """
    Migrates old database data to the new one
    """

    def handle(self, *args, **options):
        # migrate_users()
        migrate_questions()