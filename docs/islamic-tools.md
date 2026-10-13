# Islamic tools and Quran search

Dedicated Islamic search and Quran download commands.

[← Back to the README](../README.md) · [All docs](./README.md)

| Command | What it does |
|---|---|
| `.quran <surah:ayah>` | Verse in Arabic with English (Saheeh International). Example: `.quran 2:255` or `.quran Yasin 1` |
| `.sora <name or 1-114>` | Download the complete Surah as a PDF |
| `.para <1-30>` | Download the complete Juz / Para as a PDF |
| `.search quran <keyword>` | Keyword search through the English translation |
| `.quransearch <question>` | AI Quran search: finds relevant verses with a short explanation |
| `.islamsearch` (`.is`) | Islamic search |
| `.hadeessearch` (`.hs`) | Hadith search |
| `.bukhari <number>` | Sahih Bukhari hadith, Arabic and English |
| `.muslim <number>` | Sahih Muslim hadith, Arabic and English |
| `.prayertimes <city>` (`.pts`) | Daily prayer times for any city (Aladhan API) |

The AI search uses Gemini; set `GEMINI_API_KEY` as described in [settings and keys](./settings-and-keys.md). AI output can contain mistakes, so verify important rulings with a qualified scholar.
