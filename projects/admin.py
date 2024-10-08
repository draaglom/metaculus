from django.contrib import admin

from projects.models import Project, ProjectUserPermission


class ProjectUserPermissionInline(admin.TabularInline):
    model = ProjectUserPermission
    extra = 0

    autocomplete_fields = ("user",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_filter = ["type", "show_on_homepage"]
    search_fields = ["type", "name", "slug"]
    autocomplete_fields = ["created_by"]
    exclude = ["add_posts_to_main_feed"]
    inlines = [ProjectUserPermissionInline]
