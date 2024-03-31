import asyncio
import requests
import random
import logging
import sys
import asyncio
import json
from contextlib import suppress
from aiogram import F
from aiogram.utils.markdown import hlink
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.utils.media_group import MediaGroupBuilder
from aiogram.types import FSInputFile, Message
from aiogram import Bot, Dispatcher, Router, types
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.types import Message
from aiogram.utils.markdown import hbold
from pprint import pprint
global data
def GetJSON():
    data = None
    try:
        response = requests.get('https://localhost:7064/api/EventController/List', verify=False)
        response.raise_for_status()  # Raises exception for non-200 responses
        data = response.json()
    except requests.exceptions.RequestException as e:
        print("Ошибка при выполнении запроса:", e)
    except json.JSONDecodeError as e:
        print("Ошибка при декодировании JSON:", e)
    return data

async def autoUpd():
    data = GetJSON()
    pprint(data)
    await asyncio.sleep(60 * 60 * 24)

data = GetJSON()

category = set()
for p in data:
    for x in p['category']:
        if x not in category and x != '':
            category.add(x)
category = sorted(category)
pprint(category)
# я - 1151158046 группа - -1001999831766

TOKEN = "7063404348:AAFSkIjNzqDa-8C8Zbn-U1XDOwQjRykbOow"
bot = Bot(TOKEN, parse_mode=ParseMode.HTML)
dp = Dispatcher()

async def automsg():
    print("auto")
    pool = set()
    var = len(data)
    while True:
        print("1")
        while True:
            rnd = data[random.randint(1,var)]
            print("2 ",pool, rnd['id'])
            if rnd['id'] not in pool:
                print("3")
                break
        name = rnd['name']
        des = rnd['description'][0:p['description'][0:900].rfind(".") + 1]
        date = rnd['date']
        time = rnd['time']
        link = hlink("Купить билет", f"{rnd['link']}")
        album_builder = MediaGroupBuilder(caption=f"✨{hbold(name)}✨\n{des} 📖👀\nДата: {date} 📅\nВремя: {time} 🕗\n{link} 🎫💵")

        if rnd['image'] != "" and rnd['image'][0] != "h":
            album_builder.add_photo(media=f"https:{rnd['image']}")
        elif rnd['image'] != "" and rnd['image'][0] == "h":
            album_builder.add_photo(media=f"{rnd['image']}")
        else:
            album_builder.add(type="photo", media=FSInputFile("nophoto.jpeg"))
        await bot.send_media_group(chat_id="-1001999831766",media=album_builder.build())
        pool.add(rnd['id'])
        await asyncio.sleep(60*30)

async def events(message,category):
    for p in data:
        for x in p['category']:
            if x == category:
                print(p['id'], x)
                album_builder = MediaGroupBuilder(
                    caption=f"✨{hbold(p['name'])}✨\n{p['description'][0:p['description'][0:900].rfind(".")+1]} 📖👀\nДата: {p['date']} 📅\nВремя: {p['time']} 🕗\n{hlink("Купить билет",f"{p['link']}")} 🎫💵")
                #caption=f"{hbold(p['name'])}\n{p['description']}\nДата: {p['date']} Время: {p['time']}"

                if p['image'] != "" and p['image'][0] != "h":
                    album_builder.add_photo(media=f"https:{p['image']}")
                elif p['image'] != "" and p['image'][0] == "h":
                    album_builder.add_photo(media=f"{p['image']}")
                else:
                    album_builder.add(type="photo",media=FSInputFile("nophoto.jpeg"))
                await message.answer_media_group(media=album_builder.build())
                break

async def delete_message(message: types.Message, sleep_time: int = 0):
    await asyncio.sleep(sleep_time)
    await message.delete()

@dp.startup()
async def startup() -> None:
    kb = []
    for x in category:
        kb.append([types.KeyboardButton(text="/" + str(x))])
        keyboard = types.ReplyKeyboardMarkup(keyboard=kb)
    msg = await bot.send_message(chat_id="1151158046",text="get started",reply_markup=keyboard)
    #asyncio.create_task(delete_message(msg, 5))

@dp.shutdown()
async def shotdown() -> None:
    msg = await bot.send_message(chat_id="1151158046",text="get down")
    #asyncio.create_task(delete_message(msg, 5))

@dp.chat_join_request()
async def start1(update: types.ChatJoinRequest):
    await update.approve()
    kb = []
    for x in category:
        kb.append([types.KeyboardButton(text="/" + str(x))])
        keyboard = types.ReplyKeyboardMarkup(keyboard=kb)
    await bot.send_message(chat_id=update.from_user.id,
                           text=f"Здравствуй {hbold(update.from_user.full_name)}!!!"+
                                f"\nЯ бот по имени Точка и я могу вам порекомендовать различные "+
                                f"мероприятия, но для начала вам нужно выбрать одну из категорий",
                           reply_markup=keyboard)

@dp.message(F.text)
async def echo_handler(message: types.Message) -> None:
    if message.text[0] == "/" and message.text[1:] in category:
        await events(message,message.text[1:])

async def main() -> None:
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())