from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from .models import Project, Task, Activity
from .serializers import (
    RegisterSerializer, ProjectSerializer, TaskSerializer, ActivitySerializer
)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            Activity.objects.create(user=user, action=f"Account created: {user.username}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        project = serializer.save(user=self.request.user)
        Activity.objects.create(
            user=self.request.user,
            action=f"Created project: {project.name}"
        )

    def perform_update(self, serializer):
        project = serializer.save()
        Activity.objects.create(
            user=self.request.user,
            action=f"Updated project: {project.name}"
        )

    def perform_destroy(self, instance):
        Activity.objects.create(
            user=self.request.user,
            action=f"Deleted project: {instance.name}"
        )
        instance.delete()


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Task.objects.filter(user=self.request.user)
        project_id = self.request.query_params.get('project')
        status_filter = self.request.query_params.get('status')
        if project_id:
            qs = qs.filter(project_id=project_id)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def perform_create(self, serializer):
        task = serializer.save(user=self.request.user)
        Activity.objects.create(
            user=self.request.user,
            action=f"Added task: {task.title}"
        )

    def perform_update(self, serializer):
        task = serializer.save()
        action = (
            f"Completed task: {task.title}" if task.status == 'COMPLETED'
            else f"Updated task: {task.title}"
        )
        Activity.objects.create(user=self.request.user, action=action)

    def perform_destroy(self, instance):
        Activity.objects.create(
            user=self.request.user,
            action=f"Deleted task: {instance.title}"
        )
        instance.delete()


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        projects = Project.objects.filter(user=user)
        tasks = Task.objects.filter(user=user)

        total_projects = projects.count()
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='COMPLETED').count()
        pending_tasks = total_tasks - completed_tasks

        productivity = int((completed_tasks / total_tasks) * 100) if total_tasks > 0 else 0

        # Last 7 days analytics
        labels = []
        data = []
        today = timezone.now().date()
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            labels.append(day.strftime('%a'))
            count = tasks.filter(
                status='COMPLETED',
                updated_at__date=day
            ).count()
            data.append(count)

        # AI Suggestions (rule-based)
        suggestions = []
        overdue = tasks.filter(
            due_date__lt=today
        ).exclude(status='COMPLETED').count()
        if overdue > 0:
            suggestions.append(f"You have {overdue} overdue task(s). Prioritize them today!")

        high_priority = tasks.filter(
            priority='HIGH'
        ).exclude(status='COMPLETED').count()
        if high_priority > 0:
            suggestions.append(f"Focus on {high_priority} high-priority pending task(s).")

        if total_tasks > 0 and productivity < 40:
            suggestions.append("Try breaking large tasks into smaller chunks to boost productivity.")

        if total_projects == 0:
            suggestions.append("Start by creating your first project!")

        # Recent Activities
        activities = Activity.objects.filter(user=user)[:10]

        return Response({
            'total_projects': total_projects,
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'productivity_percentage': productivity,
            'analytics': {
                'labels': labels,
                'data': data,
            },
            'ai_suggestions': suggestions,
            'recent_activities': ActivitySerializer(activities, many=True).data,
        })