from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, ProjectViewSet, TaskViewSet, DashboardStatsView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]