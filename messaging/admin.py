from django.contrib import admin
from .models import Conversation, Message

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'created_at', 'updated_at')
    list_filter = ('type',)
    filter_horizontal = ('participants',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'conversation', 'is_read', 'timestamp')
    list_filter = ('is_read', 'timestamp')
    search_fields = ('content', 'sender__company_name')
