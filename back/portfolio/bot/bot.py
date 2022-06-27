import os
from telegram import Bot

def send_telegram(message):
    api_key = os.environ.get('API_KEY_BOT')
    user_id = os.environ.get('USER_ID_BOT')

    bot = Bot(token=api_key)
    bot.send_message(chat_id=user_id, text=message)
