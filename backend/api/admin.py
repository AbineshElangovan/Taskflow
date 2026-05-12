from django.contrib import admin
from .models import Project, Task, Activity

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'priority', 'status', 'due_date', 'created_at']
    list_filter = ['priority', 'status']
    search_fields = ['name', 'description']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'project', 'priority', 'status', 'due_date']
    list_filter = ['priority', 'status']
    search_fields = ['title']

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'created_at']
    list_filter = ['created_at']