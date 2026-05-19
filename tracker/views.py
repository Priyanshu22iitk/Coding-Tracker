from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CodingProblem
from .serializers import CodingProblemSerializer

@api_view(['GET', 'POST'])
def problem_list(request):
    if request.method == 'GET':
        problems = CodingProblem.objects.all().order_by('-date_solved')
        serializer = CodingProblemSerializer(problems, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CodingProblemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Create your views here.
@api_view(['DELETE'])
def problem_detail(request, pk):
    try:
        problem = CodingProblem.objects.get(pk=pk)
    except CodingProblem.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        problem.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)