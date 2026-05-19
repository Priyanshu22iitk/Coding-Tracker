from rest_framework import serializers
from .models import CodingProblem

class CodingProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingProblem
        fields = '__all__' # This exposes all columns (id, title, platform, difficulty, etc.)