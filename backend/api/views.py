from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

# Create your views here.
class Index(APIView):
	permission_classes = (permissions.AllowAny,)
	def get(self, response):
		return Response({"status": "online"}, status=status.HTTP_200_OK)