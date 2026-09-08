-- ============================================================
-- «Стоя» / Stoa — seed контента (цитаты и практики)
-- Запускается сервисной ролью (SQL Editor) после 0001_init.sql.
-- Полный контент-план — docs/09-build-plan.md (36 цитат, 6 практик —
-- полностью совпадают с web/src/lib/quotes.ts и practices.ts).
-- ============================================================

insert into public.quotes (author_ru, author_en, source_ru, source_en, text_ru, text_en) values
('Марк Аврелий','Marcus Aurelius','«Размышления»','Meditations',
 'Поутру скажи себе: сегодня я встречу людей суетных, неблагодарных и заносчивых. Никто из них не может причинить мне зла — ведь я сам выбираю, как к этому отнестись.',
 'Begin each day by telling yourself: today I shall meet people who are interfering, ungrateful and arrogant. None of them can hurt me — for I alone choose how to respond.'),
('Эпиктет','Epictetus','«Энхиридион»','Enchiridion',
 'Не вещи тревожат людей, а их суждения о вещах.',
 'It is not things that trouble people, but their judgments about things.'),
('Сенека','Seneca','«Письма к Луцилию»','Letters to Lucilius',
 'Пока мы откладываем жизнь, она проходит.',
 'While we postpone, life speeds by.'),
('Марк Аврелий','Marcus Aurelius','«Размышления»','Meditations',
 'У тебя есть власть над своим умом — но не над внешними событиями. Осознай это — и обретёшь силу.',
 'You have power over your mind — not outside events. Realize this, and you will find strength.'),
('Сенека','Seneca','«Письма к Луцилию»','Letters to Lucilius',
 'Мы страдаем чаще в воображении, чем в действительности.',
 'We suffer more often in imagination than in reality.'),
('Эпиктет','Epictetus','«Беседы»','Discourses',
 'Сначала скажи себе, кем ты хочешь быть, а затем делай то, что должен делать.',
 'First say to yourself what you would be; and then do what you have to do.'),
('Марк Аврелий','Marcus Aurelius','«Размышления»','Meditations',
 'Препятствие к действию становится путём. То, что мешает, — помогает.',
 'The impediment to action advances action. What stands in the way becomes the way.'),
('Сенека','Seneca','«О скоротечности жизни»','On the Shortness of Life',
 'Ожидание — главная помеха жизни: оно зависит от завтрашнего дня и губит сегодняшний.',
 'Expectation is the greatest impediment to living: it hangs upon tomorrow and loses today.'),
('Эпиктет','Epictetus','«Энхиридион»','Enchiridion',
 'Не проси, чтобы события происходили так, как ты хочешь; желай, чтобы они происходили так, как происходят, — и жизнь твоя будет спокойна.',
 'Do not ask for things to happen as you wish; wish them to happen as they do — and your life will flow well.'),
('Марк Аврелий','Marcus Aurelius','«Размышления»','Meditations',
 'Душа окрашивается цветом твоих мыслей.',
 'The soul becomes dyed with the color of its thoughts.'),
('Сенека','Seneca','«Письма к Луцилию»','Letters to Lucilius',
 'Мы не отваживаемся на многое не потому, что оно трудно; оно трудно потому, что мы не отваживаемся.',
 'It is not because things are difficult that we do not dare; they are difficult because we do not dare.'),
('Эпиктет','Epictetus','«Энхиридион»','Enchiridion',
 'В нашей власти — наши суждения, стремления и действия. Вне нашей власти — тело, имущество, репутация, должности.',
 'Up to us are our judgments, strivings and actions. Not up to us are the body, property, reputation and offices.');

-- Практики: соответствуют web/src/lib/practices.ts (6 из 12 по контент-плану)
insert into public.practices (slug, icon, duration_min, category_ru, category_en, title_ru, title_en, why_ru, why_en, steps_ru, steps_en, example_ru, example_en) values
('dichotomy-of-control','⚖️',5,'Принятие','Acceptance','Дихотомия контроля','Dichotomy of Control',
 'Эпиктет начинает «Энхиридион» с разделения всего на зависящее и не зависящее от нас. Тревога почти всегда направлена на второе. Упражнение возвращает внимание туда, где у вас есть власть.',
 'Epictetus opens the Enchiridion by dividing everything into what is and what is not up to us. Anxiety almost always targets the latter. This practice returns attention to where you have power.',
 '["Выпишите всё, что вас сейчас тревожит, — крупное и мелкое.","Проведите черту: слева «в моей власти», справа — «вне её».","Правую колонку скажите вслух: «Это не в моей власти» — и отпустите.","Из левой колонки выберите одно действие и выполните его сегодня."]',
 '["Write down everything currently worrying you — big and small.","Draw a line: left — “up to me”; right — “not up to me”.","Say the right column out loud: “This is not up to me” — and let it go.","From the left column, pick one action and do it today."]',
 '«Рейс задержали» — вне моей власти. «Как я проведу это время в аэропорту» — в моей.',
 '“The flight is delayed” — not up to me. “How I spend this time at the airport” — up to me.'),

('negative-visualization','🌫',10,'Принятие','Acceptance','Негативная визуализация','Negative Visualization',
 'Стоики мысленно «теряли» то, что имеют, — чтобы ценить настоящее и быть готовыми к переменам. Это не про тревогу, а про благодарность и устойчивость.',
 'The Stoics mentally “lost” what they had — to appreciate the present and prepare for change. This is about gratitude and resilience, not anxiety.',
 '["Выберите то, что вам дорого: человек, здоровье, работа, привычный уклад.","На 60 секунд представьте, что этого больше нет. Почувствуйте пустоту.","Вернитесь в настоящее: «Сейчас это у меня есть».","Сформулируйте одну благодарность и запишите её."]',
 '["Choose something dear to you: a person, health, work, a routine.","For 60 seconds, imagine it is gone. Feel the absence.","Return to the present: “Right now, I still have it.”","Formulate one gratitude and write it down."]',
 'Утренний кофе, звонок маме, возможность бегать — что исчезло бы без следа, если бы день сложился иначе?',
 'Morning coffee, a call to your mother, the ability to run — what would vanish without a trace if the day went differently?'),

('memento-mori','🕯',7,'Смерть и время','Death & Time','Memento mori','Memento Mori',
 '«Помни о смерти» — не мрачный лозунг, а напоминание о цене времени. Оно обостряет вопрос: «На что я трачу сегодняшний день?»',
 '“Remember death” is not a gloomy slogan but a reminder of the price of time. It sharpens the question: “What am I spending today on?”',
 '["Скажите себе спокойно, без драмы: «Этот день не бесконечен. И я тоже».","Спросите: что из запланированного я делаю из страха, а не из смысла?","Уберите одну «не свою» задачу из списка.","Сделайте одну маленькую вещь, которую давно откладывали."]',
 '["Tell yourself calmly, without drama: “This day is not endless. Neither am I.”","Ask: which of my plans come from fear rather than meaning?","Remove one “not mine” task from the list.","Do one small thing you have long postponed."]',
 'Сенека: «Не то, что у нас мало времени, а то, что мы много его теряем» — а вы сегодня знаете цену.',
 'Seneca: “It is not that we have a short time to live, but that we waste much of it.” Today you know its price.'),

('amor-fati','🔥',6,'Дисциплина','Discipline','Amor fati — любовь к судьбе','Amor Fati — Love of Fate',
 'Не просто терпеть происходящее, а видеть в нём материал для роста. Препятствие становится путём.',
 'Not merely to endure what happens, but to see in it material for growth. The obstacle becomes the way.',
 '["Вспомните неприятное событие недели.","Спросите: «Что хорошего оно уже принесло или может принести?»","Найдите три ответа — даже неожиданных.","Переформулируйте событие в одну фразу со словом «благодаря»."]',
 '["Recall an unpleasant event from this week.","Ask: “What good has it already brought or may bring?”","Find three answers — even surprising ones.","Reframe the event in one sentence starting with “thanks to”."]',
 '«Отказ на собеседовании» → «Благодаря отказу я увидел, что презентация была слабой» → план: улучшить её.',
 '“Rejected at the interview” → “Thanks to the rejection I saw my presentation was weak” → plan: improve it.'),

('view-from-above','🌌',8,'Спокойствие','Calm','Взгляд сверху','View from Above',
 'Марк Аврелий советовал смотреть на вещи с высоты — так проблемы возвращаются к своему настоящему размеру.',
 'Marcus Aurelius advised viewing things from above — this returns problems to their true size.',
 '["Закройте глаза и представьте свою комнату, дом, улицу, город — всё выше и выше.","Найдите на этой карте свою сегодняшнюю проблему. Каков её размер?","Представьте время: неделю, год, десять лет. Что останется важным?","Запишите одну мысль, которая пришла."]',
 '["Close your eyes and picture your room, home, street, city — higher and higher.","Find today''s problem on this map. How big is it?","Picture time: a week, a year, ten years. What will still matter?","Write down one thought that came."]',
 'Спор в чате кажется огромным — а с высоты города он меньше точки. Что важно: спор или вечер с семьёй?',
 'An argument in a group chat feels huge — from above the city it is smaller than a dot. What matters: the argument or an evening with family?'),

('seneca-evening-review','🌙',5,'Ритуалы','Rituals','Вечерний разбор Сенеки','Seneca''s Evening Review',
 'Сенека каждый вечер задавал себе три вопроса и проверял день, как судья — прожитое. Разбор превращает ошибки в уроки, а успехи — в привычку.',
 'Seneca asked himself three questions every night and examined the day like a judge. The review turns mistakes into lessons and successes into habits.',
 '["Вспомните день от пробуждения до этого момента — крупными мазками.","Спросите: «Какой свой порок я сегодня исцелил? Против чего устоял? В чём стал лучше?»","Простите себе сегодняшние промахи — и запишите, как поступить завтра.","Поблагодарите себя за одно дело, доведённое до конца."]',
 '["Recall the day from waking to now — in broad strokes.","Ask: “Which fault of mine did I heal today? What did I resist? Where did I become better?”","Forgive yourself today''s slips — and write down how to act tomorrow.","Thank yourself for one thing you finished."]',
 '«Вспылил в споре» → урок: пауза в три вдоха перед ответом. Завтра начну с этого.',
 '“I lost my temper in an argument” → lesson: pause for three breaths before answering. Start with that tomorrow.');
