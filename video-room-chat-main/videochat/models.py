from django.db import models

class RoomMember(models.Model):
    name = models.CharField(max_length=255)
    uid = models.IntegerField()
    room_name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
     