from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import random
import time
import json
from django.http import JsonResponse
from .models import RoomMember
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET", "POST"])

def getToken(request):
    appId = 'efb107e5a1414fff9d3cc87cc9cfc452'
    appCertificate = '6390b8e856d94d46a7a76cdf77c22c4a'
    channelName = request.GET.get('channel')
    uid = random.randint(1, 230)
    expirationTimeInSecond = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSecond
    role = 7
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token': token, 'uid': uid}, safe=False)

def Lobby(request):
    return render(request, 'videochat/lobby.html')

def room(request):
    return render(request, 'videochat/room.html')

def main(request):
    return render(request, 'videochat/main.html')

@csrf_exempt
def createMember(request):
    data = json.loads(request.body)
    member, created = RoomMember.objects.get_or_create(
        name=data['name'],
        uid=data['uid'],
        room_name=data['room_name']
    )
    return JsonResponse({'name': data['name'], 'uid': data['uid']}, safe=False)

def getMember(request):
    uid = request.GET.get('uid')
    room_name = request.GET.get('room_name')

    member = get_object_or_404(RoomMember, uid=uid, room_name=room_name)
    return JsonResponse({'name': member.name}, safe=False)