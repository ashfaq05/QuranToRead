// Verified Uthmani Arabic, Hindi (Suhel Farooq Khan & Saifur Rahman Nadwi), and Transliteration metadata
export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
  startPage: number;
  startJuz: number;
}

export interface AyahData {
  n: number;
  p: number;
  j: number;
  ar: string;
  hg: string;
  hi: string;
  tr: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: AyahData[];
}

export interface JuzEntry {
  juz: number;
  surah: number;
  ayah: number;
  page: number;
  surahName: string;
}

export const TOTAL_QURAN_VERSES = 6236;
export const TOTAL_QURAN_PAGES = 604;
export const TOTAL_QURAN_JUZ = 30;

export const SURAH_META: SurahMeta[] = [
  {
    "number": 1,
    "name": "سُورَةُ ٱلْفَاتِحَةِ",
    "englishName": "Al-Faatiha",
    "englishNameTranslation": "The Opening",
    "revelationType": "Meccan",
    "numberOfAyahs": 7,
    "startPage": 1,
    "startJuz": 1
  },
  {
    "number": 2,
    "name": "سُورَةُ البَقَرَةِ",
    "englishName": "Al-Baqara",
    "englishNameTranslation": "The Cow",
    "revelationType": "Medinan",
    "numberOfAyahs": 286,
    "startPage": 2,
    "startJuz": 1
  },
  {
    "number": 3,
    "name": "سُورَةُ آلِ عِمۡرَانَ",
    "englishName": "Aal-i-Imraan",
    "englishNameTranslation": "The Family of Imraan",
    "revelationType": "Medinan",
    "numberOfAyahs": 200,
    "startPage": 50,
    "startJuz": 3
  },
  {
    "number": 4,
    "name": "سُورَةُ النِّسَاءِ",
    "englishName": "An-Nisaa",
    "englishNameTranslation": "The Women",
    "revelationType": "Medinan",
    "numberOfAyahs": 176,
    "startPage": 77,
    "startJuz": 4
  },
  {
    "number": 5,
    "name": "سُورَةُ المَائـِدَةِ",
    "englishName": "Al-Maaida",
    "englishNameTranslation": "The Table",
    "revelationType": "Medinan",
    "numberOfAyahs": 120,
    "startPage": 106,
    "startJuz": 6
  },
  {
    "number": 6,
    "name": "سُورَةُ الأَنۡعَامِ",
    "englishName": "Al-An'aam",
    "englishNameTranslation": "The Cattle",
    "revelationType": "Meccan",
    "numberOfAyahs": 165,
    "startPage": 128,
    "startJuz": 7
  },
  {
    "number": 7,
    "name": "سُورَةُ الأَعۡرَافِ",
    "englishName": "Al-A'raaf",
    "englishNameTranslation": "The Heights",
    "revelationType": "Meccan",
    "numberOfAyahs": 206,
    "startPage": 151,
    "startJuz": 8
  },
  {
    "number": 8,
    "name": "سُورَةُ الأَنفَالِ",
    "englishName": "Al-Anfaal",
    "englishNameTranslation": "The Spoils of War",
    "revelationType": "Medinan",
    "numberOfAyahs": 75,
    "startPage": 177,
    "startJuz": 9
  },
  {
    "number": 9,
    "name": "سُورَةُ التَّوۡبَةِ",
    "englishName": "At-Tawba",
    "englishNameTranslation": "The Repentance",
    "revelationType": "Medinan",
    "numberOfAyahs": 129,
    "startPage": 187,
    "startJuz": 10
  },
  {
    "number": 10,
    "name": "سُورَةُ يُونُسَ",
    "englishName": "Yunus",
    "englishNameTranslation": "Jonas",
    "revelationType": "Meccan",
    "numberOfAyahs": 109,
    "startPage": 208,
    "startJuz": 11
  },
  {
    "number": 11,
    "name": "سُورَةُ هُودٍ",
    "englishName": "Hud",
    "englishNameTranslation": "Hud",
    "revelationType": "Meccan",
    "numberOfAyahs": 123,
    "startPage": 221,
    "startJuz": 11
  },
  {
    "number": 12,
    "name": "سُورَةُ يُوسُفَ",
    "englishName": "Yusuf",
    "englishNameTranslation": "Joseph",
    "revelationType": "Meccan",
    "numberOfAyahs": 111,
    "startPage": 235,
    "startJuz": 12
  },
  {
    "number": 13,
    "name": "سُورَةُ الرَّعۡدِ",
    "englishName": "Ar-Ra'd",
    "englishNameTranslation": "The Thunder",
    "revelationType": "Medinan",
    "numberOfAyahs": 43,
    "startPage": 249,
    "startJuz": 13
  },
  {
    "number": 14,
    "name": "سُورَةُ إِبۡرَاهِيمَ",
    "englishName": "Ibrahim",
    "englishNameTranslation": "Abraham",
    "revelationType": "Meccan",
    "numberOfAyahs": 52,
    "startPage": 255,
    "startJuz": 13
  },
  {
    "number": 15,
    "name": "سُورَةُ الحِجۡرِ",
    "englishName": "Al-Hijr",
    "englishNameTranslation": "The Rock",
    "revelationType": "Meccan",
    "numberOfAyahs": 99,
    "startPage": 262,
    "startJuz": 14
  },
  {
    "number": 16,
    "name": "سُورَةُ النَّحۡلِ",
    "englishName": "An-Nahl",
    "englishNameTranslation": "The Bee",
    "revelationType": "Meccan",
    "numberOfAyahs": 128,
    "startPage": 267,
    "startJuz": 14
  },
  {
    "number": 17,
    "name": "سُورَةُ الإِسۡرَاءِ",
    "englishName": "Al-Israa",
    "englishNameTranslation": "The Night Journey",
    "revelationType": "Meccan",
    "numberOfAyahs": 111,
    "startPage": 282,
    "startJuz": 15
  },
  {
    "number": 18,
    "name": "سُورَةُ الكَهۡفِ",
    "englishName": "Al-Kahf",
    "englishNameTranslation": "The Cave",
    "revelationType": "Meccan",
    "numberOfAyahs": 110,
    "startPage": 293,
    "startJuz": 15
  },
  {
    "number": 19,
    "name": "سُورَةُ مَرۡيَمَ",
    "englishName": "Maryam",
    "englishNameTranslation": "Mary",
    "revelationType": "Meccan",
    "numberOfAyahs": 98,
    "startPage": 305,
    "startJuz": 16
  },
  {
    "number": 20,
    "name": "سُورَةُ طه",
    "englishName": "Taa-Haa",
    "englishNameTranslation": "Taa-Haa",
    "revelationType": "Meccan",
    "numberOfAyahs": 135,
    "startPage": 312,
    "startJuz": 16
  },
  {
    "number": 21,
    "name": "سُورَةُ الأَنبِيَاءِ",
    "englishName": "Al-Anbiyaa",
    "englishNameTranslation": "The Prophets",
    "revelationType": "Meccan",
    "numberOfAyahs": 112,
    "startPage": 322,
    "startJuz": 17
  },
  {
    "number": 22,
    "name": "سُورَةُ الحَجِّ",
    "englishName": "Al-Hajj",
    "englishNameTranslation": "The Pilgrimage",
    "revelationType": "Medinan",
    "numberOfAyahs": 78,
    "startPage": 332,
    "startJuz": 17
  },
  {
    "number": 23,
    "name": "سُورَةُ المُؤۡمِنُونَ",
    "englishName": "Al-Muminoon",
    "englishNameTranslation": "The Believers",
    "revelationType": "Meccan",
    "numberOfAyahs": 118,
    "startPage": 342,
    "startJuz": 18
  },
  {
    "number": 24,
    "name": "سُورَةُ النُّورِ",
    "englishName": "An-Noor",
    "englishNameTranslation": "The Light",
    "revelationType": "Medinan",
    "numberOfAyahs": 64,
    "startPage": 350,
    "startJuz": 18
  },
  {
    "number": 25,
    "name": "سُورَةُ الفُرۡقَانِ",
    "englishName": "Al-Furqaan",
    "englishNameTranslation": "The Criterion",
    "revelationType": "Meccan",
    "numberOfAyahs": 77,
    "startPage": 359,
    "startJuz": 18
  },
  {
    "number": 26,
    "name": "سُورَةُ الشُّعَرَاءِ",
    "englishName": "Ash-Shu'araa",
    "englishNameTranslation": "The Poets",
    "revelationType": "Meccan",
    "numberOfAyahs": 227,
    "startPage": 367,
    "startJuz": 19
  },
  {
    "number": 27,
    "name": "سُورَةُ النَّمۡلِ",
    "englishName": "An-Naml",
    "englishNameTranslation": "The Ant",
    "revelationType": "Meccan",
    "numberOfAyahs": 93,
    "startPage": 377,
    "startJuz": 19
  },
  {
    "number": 28,
    "name": "سُورَةُ القَصَصِ",
    "englishName": "Al-Qasas",
    "englishNameTranslation": "The Stories",
    "revelationType": "Meccan",
    "numberOfAyahs": 88,
    "startPage": 385,
    "startJuz": 20
  },
  {
    "number": 29,
    "name": "سُورَةُ العَنكَبُوتِ",
    "englishName": "Al-Ankaboot",
    "englishNameTranslation": "The Spider",
    "revelationType": "Meccan",
    "numberOfAyahs": 69,
    "startPage": 396,
    "startJuz": 20
  },
  {
    "number": 30,
    "name": "سُورَةُ الرُّومِ",
    "englishName": "Ar-Room",
    "englishNameTranslation": "The Romans",
    "revelationType": "Meccan",
    "numberOfAyahs": 60,
    "startPage": 404,
    "startJuz": 21
  },
  {
    "number": 31,
    "name": "سُورَةُ لُقۡمَانَ",
    "englishName": "Luqman",
    "englishNameTranslation": "Luqman",
    "revelationType": "Meccan",
    "numberOfAyahs": 34,
    "startPage": 411,
    "startJuz": 21
  },
  {
    "number": 32,
    "name": "سُورَةُ السَّجۡدَةِ",
    "englishName": "As-Sajda",
    "englishNameTranslation": "The Prostration",
    "revelationType": "Meccan",
    "numberOfAyahs": 30,
    "startPage": 415,
    "startJuz": 21
  },
  {
    "number": 33,
    "name": "سُورَةُ الأَحۡزَابِ",
    "englishName": "Al-Ahzaab",
    "englishNameTranslation": "The Clans",
    "revelationType": "Medinan",
    "numberOfAyahs": 73,
    "startPage": 418,
    "startJuz": 21
  },
  {
    "number": 34,
    "name": "سُورَةُ سَبَإٍ",
    "englishName": "Saba",
    "englishNameTranslation": "Sheba",
    "revelationType": "Meccan",
    "numberOfAyahs": 54,
    "startPage": 428,
    "startJuz": 22
  },
  {
    "number": 35,
    "name": "سُورَةُ فَاطِرٍ",
    "englishName": "Faatir",
    "englishNameTranslation": "The Originator",
    "revelationType": "Meccan",
    "numberOfAyahs": 45,
    "startPage": 434,
    "startJuz": 22
  },
  {
    "number": 36,
    "name": "سُورَةُ يسٓ",
    "englishName": "Yaseen",
    "englishNameTranslation": "Yaseen",
    "revelationType": "Meccan",
    "numberOfAyahs": 83,
    "startPage": 440,
    "startJuz": 22
  },
  {
    "number": 37,
    "name": "سُورَةُ الصَّافَّاتِ",
    "englishName": "As-Saaffaat",
    "englishNameTranslation": "Those drawn up in Ranks",
    "revelationType": "Meccan",
    "numberOfAyahs": 182,
    "startPage": 446,
    "startJuz": 23
  },
  {
    "number": 38,
    "name": "سُورَةُ صٓ",
    "englishName": "Saad",
    "englishNameTranslation": "The letter Saad",
    "revelationType": "Meccan",
    "numberOfAyahs": 88,
    "startPage": 453,
    "startJuz": 23
  },
  {
    "number": 39,
    "name": "سُورَةُ الزُّمَرِ",
    "englishName": "Az-Zumar",
    "englishNameTranslation": "The Groups",
    "revelationType": "Meccan",
    "numberOfAyahs": 75,
    "startPage": 458,
    "startJuz": 23
  },
  {
    "number": 40,
    "name": "سُورَةُ غَافِرٍ",
    "englishName": "Ghafir",
    "englishNameTranslation": "The Forgiver",
    "revelationType": "Meccan",
    "numberOfAyahs": 85,
    "startPage": 467,
    "startJuz": 24
  },
  {
    "number": 41,
    "name": "سُورَةُ فُصِّلَتۡ",
    "englishName": "Fussilat",
    "englishNameTranslation": "Explained in detail",
    "revelationType": "Meccan",
    "numberOfAyahs": 54,
    "startPage": 477,
    "startJuz": 24
  },
  {
    "number": 42,
    "name": "سُورَةُ الشُّورَىٰ",
    "englishName": "Ash-Shura",
    "englishNameTranslation": "Consultation",
    "revelationType": "Meccan",
    "numberOfAyahs": 53,
    "startPage": 483,
    "startJuz": 25
  },
  {
    "number": 43,
    "name": "سُورَةُ الزُّخۡرُفِ",
    "englishName": "Az-Zukhruf",
    "englishNameTranslation": "Ornaments of gold",
    "revelationType": "Meccan",
    "numberOfAyahs": 89,
    "startPage": 489,
    "startJuz": 25
  },
  {
    "number": 44,
    "name": "سُورَةُ الدُّخَانِ",
    "englishName": "Ad-Dukhaan",
    "englishNameTranslation": "The Smoke",
    "revelationType": "Meccan",
    "numberOfAyahs": 59,
    "startPage": 496,
    "startJuz": 25
  },
  {
    "number": 45,
    "name": "سُورَةُ الجَاثِيَةِ",
    "englishName": "Al-Jaathiya",
    "englishNameTranslation": "Crouching",
    "revelationType": "Meccan",
    "numberOfAyahs": 37,
    "startPage": 499,
    "startJuz": 25
  },
  {
    "number": 46,
    "name": "سُورَةُ الأَحۡقَافِ",
    "englishName": "Al-Ahqaf",
    "englishNameTranslation": "The Dunes",
    "revelationType": "Meccan",
    "numberOfAyahs": 35,
    "startPage": 502,
    "startJuz": 26
  },
  {
    "number": 47,
    "name": "سُورَةُ مُحَمَّدٍ",
    "englishName": "Muhammad",
    "englishNameTranslation": "Muhammad",
    "revelationType": "Medinan",
    "numberOfAyahs": 38,
    "startPage": 507,
    "startJuz": 26
  },
  {
    "number": 48,
    "name": "سُورَةُ الفَتۡحِ",
    "englishName": "Al-Fath",
    "englishNameTranslation": "The Victory",
    "revelationType": "Medinan",
    "numberOfAyahs": 29,
    "startPage": 511,
    "startJuz": 26
  },
  {
    "number": 49,
    "name": "سُورَةُ الحُجُرَاتِ",
    "englishName": "Al-Hujuraat",
    "englishNameTranslation": "The Inner Apartments",
    "revelationType": "Medinan",
    "numberOfAyahs": 18,
    "startPage": 515,
    "startJuz": 26
  },
  {
    "number": 50,
    "name": "سُورَةُ قٓ",
    "englishName": "Qaaf",
    "englishNameTranslation": "The letter Qaaf",
    "revelationType": "Meccan",
    "numberOfAyahs": 45,
    "startPage": 518,
    "startJuz": 26
  },
  {
    "number": 51,
    "name": "سُورَةُ الذَّارِيَاتِ",
    "englishName": "Adh-Dhaariyat",
    "englishNameTranslation": "The Winnowing Winds",
    "revelationType": "Meccan",
    "numberOfAyahs": 60,
    "startPage": 520,
    "startJuz": 26
  },
  {
    "number": 52,
    "name": "سُورَةُ الطُّورِ",
    "englishName": "At-Tur",
    "englishNameTranslation": "The Mount",
    "revelationType": "Meccan",
    "numberOfAyahs": 49,
    "startPage": 523,
    "startJuz": 27
  },
  {
    "number": 53,
    "name": "سُورَةُ النَّجۡمِ",
    "englishName": "An-Najm",
    "englishNameTranslation": "The Star",
    "revelationType": "Meccan",
    "numberOfAyahs": 62,
    "startPage": 526,
    "startJuz": 27
  },
  {
    "number": 54,
    "name": "سُورَةُ القَمَرِ",
    "englishName": "Al-Qamar",
    "englishNameTranslation": "The Moon",
    "revelationType": "Meccan",
    "numberOfAyahs": 55,
    "startPage": 528,
    "startJuz": 27
  },
  {
    "number": 55,
    "name": "سُورَةُ الرَّحۡمَٰن",
    "englishName": "Ar-Rahmaan",
    "englishNameTranslation": "The Beneficent",
    "revelationType": "Medinan",
    "numberOfAyahs": 78,
    "startPage": 531,
    "startJuz": 27
  },
  {
    "number": 56,
    "name": "سُورَةُ الوَاقِعَةِ",
    "englishName": "Al-Waaqia",
    "englishNameTranslation": "The Inevitable",
    "revelationType": "Meccan",
    "numberOfAyahs": 96,
    "startPage": 534,
    "startJuz": 27
  },
  {
    "number": 57,
    "name": "سُورَةُ الحَدِيدِ",
    "englishName": "Al-Hadid",
    "englishNameTranslation": "The Iron",
    "revelationType": "Medinan",
    "numberOfAyahs": 29,
    "startPage": 537,
    "startJuz": 27
  },
  {
    "number": 58,
    "name": "سُورَةُ المُجَادلَةِ",
    "englishName": "Al-Mujaadila",
    "englishNameTranslation": "The Pleading Woman",
    "revelationType": "Medinan",
    "numberOfAyahs": 22,
    "startPage": 542,
    "startJuz": 28
  },
  {
    "number": 59,
    "name": "سُورَةُ الحَشۡرِ",
    "englishName": "Al-Hashr",
    "englishNameTranslation": "The Exile",
    "revelationType": "Medinan",
    "numberOfAyahs": 24,
    "startPage": 545,
    "startJuz": 28
  },
  {
    "number": 60,
    "name": "سُورَةُ المُمۡتَحنَةِ",
    "englishName": "Al-Mumtahana",
    "englishNameTranslation": "She that is to be examined",
    "revelationType": "Medinan",
    "numberOfAyahs": 13,
    "startPage": 549,
    "startJuz": 28
  },
  {
    "number": 61,
    "name": "سُورَةُ الصَّفِّ",
    "englishName": "As-Saff",
    "englishNameTranslation": "The Ranks",
    "revelationType": "Medinan",
    "numberOfAyahs": 14,
    "startPage": 551,
    "startJuz": 28
  },
  {
    "number": 62,
    "name": "سُورَةُ الجُمُعَةِ",
    "englishName": "Al-Jumu'a",
    "englishNameTranslation": "Friday",
    "revelationType": "Medinan",
    "numberOfAyahs": 11,
    "startPage": 553,
    "startJuz": 28
  },
  {
    "number": 63,
    "name": "سُورَةُ المُنَافِقُونَ",
    "englishName": "Al-Munaafiqoon",
    "englishNameTranslation": "The Hypocrites",
    "revelationType": "Medinan",
    "numberOfAyahs": 11,
    "startPage": 554,
    "startJuz": 28
  },
  {
    "number": 64,
    "name": "سُورَةُ التَّغَابُنِ",
    "englishName": "At-Taghaabun",
    "englishNameTranslation": "Mutual Disillusion",
    "revelationType": "Medinan",
    "numberOfAyahs": 18,
    "startPage": 556,
    "startJuz": 28
  },
  {
    "number": 65,
    "name": "سُورَةُ الطَّلَاقِ",
    "englishName": "At-Talaaq",
    "englishNameTranslation": "Divorce",
    "revelationType": "Medinan",
    "numberOfAyahs": 12,
    "startPage": 558,
    "startJuz": 28
  },
  {
    "number": 66,
    "name": "سُورَةُ التَّحۡرِيمِ",
    "englishName": "At-Tahrim",
    "englishNameTranslation": "The Prohibition",
    "revelationType": "Medinan",
    "numberOfAyahs": 12,
    "startPage": 560,
    "startJuz": 28
  },
  {
    "number": 67,
    "name": "سُورَةُ المُلۡكِ",
    "englishName": "Al-Mulk",
    "englishNameTranslation": "The Sovereignty",
    "revelationType": "Meccan",
    "numberOfAyahs": 30,
    "startPage": 562,
    "startJuz": 29
  },
  {
    "number": 68,
    "name": "سُورَةُ القَلَمِ",
    "englishName": "Al-Qalam",
    "englishNameTranslation": "The Pen",
    "revelationType": "Meccan",
    "numberOfAyahs": 52,
    "startPage": 564,
    "startJuz": 29
  },
  {
    "number": 69,
    "name": "سُورَةُ الحَاقَّةِ",
    "englishName": "Al-Haaqqa",
    "englishNameTranslation": "The Reality",
    "revelationType": "Meccan",
    "numberOfAyahs": 52,
    "startPage": 566,
    "startJuz": 29
  },
  {
    "number": 70,
    "name": "سُورَةُ المَعَارِجِ",
    "englishName": "Al-Ma'aarij",
    "englishNameTranslation": "The Ascending Stairways",
    "revelationType": "Meccan",
    "numberOfAyahs": 44,
    "startPage": 568,
    "startJuz": 29
  },
  {
    "number": 71,
    "name": "سُورَةُ نُوحٍ",
    "englishName": "Nooh",
    "englishNameTranslation": "Noah",
    "revelationType": "Meccan",
    "numberOfAyahs": 28,
    "startPage": 570,
    "startJuz": 29
  },
  {
    "number": 72,
    "name": "سُورَةُ الجِنِّ",
    "englishName": "Al-Jinn",
    "englishNameTranslation": "The Jinn",
    "revelationType": "Meccan",
    "numberOfAyahs": 28,
    "startPage": 572,
    "startJuz": 29
  },
  {
    "number": 73,
    "name": "سُورَةُ المُزَّمِّلِ",
    "englishName": "Al-Muzzammil",
    "englishNameTranslation": "The Enshrouded One",
    "revelationType": "Meccan",
    "numberOfAyahs": 20,
    "startPage": 574,
    "startJuz": 29
  },
  {
    "number": 74,
    "name": "سُورَةُ المُدَّثِّرِ",
    "englishName": "Al-Muddaththir",
    "englishNameTranslation": "The Cloaked One",
    "revelationType": "Meccan",
    "numberOfAyahs": 56,
    "startPage": 575,
    "startJuz": 29
  },
  {
    "number": 75,
    "name": "سُورَةُ القِيَامَةِ",
    "englishName": "Al-Qiyaama",
    "englishNameTranslation": "The Resurrection",
    "revelationType": "Meccan",
    "numberOfAyahs": 40,
    "startPage": 577,
    "startJuz": 29
  },
  {
    "number": 76,
    "name": "سُورَةُ الإِنسَانِ",
    "englishName": "Al-Insaan",
    "englishNameTranslation": "Man",
    "revelationType": "Medinan",
    "numberOfAyahs": 31,
    "startPage": 578,
    "startJuz": 29
  },
  {
    "number": 77,
    "name": "سُورَةُ المُرۡسَلَاتِ",
    "englishName": "Al-Mursalaat",
    "englishNameTranslation": "The Emissaries",
    "revelationType": "Meccan",
    "numberOfAyahs": 50,
    "startPage": 580,
    "startJuz": 29
  },
  {
    "number": 78,
    "name": "سُورَةُ النَّبَإِ",
    "englishName": "An-Naba",
    "englishNameTranslation": "The Announcement",
    "revelationType": "Meccan",
    "numberOfAyahs": 40,
    "startPage": 582,
    "startJuz": 30
  },
  {
    "number": 79,
    "name": "سُورَةُ النَّازِعَاتِ",
    "englishName": "An-Naazi'aat",
    "englishNameTranslation": "Those who drag forth",
    "revelationType": "Meccan",
    "numberOfAyahs": 46,
    "startPage": 583,
    "startJuz": 30
  },
  {
    "number": 80,
    "name": "سُورَةُ عَبَسَ",
    "englishName": "Abasa",
    "englishNameTranslation": "He frowned",
    "revelationType": "Meccan",
    "numberOfAyahs": 42,
    "startPage": 585,
    "startJuz": 30
  },
  {
    "number": 81,
    "name": "سُورَةُ التَّكۡوِيرِ",
    "englishName": "At-Takwir",
    "englishNameTranslation": "The Overthrowing",
    "revelationType": "Meccan",
    "numberOfAyahs": 29,
    "startPage": 586,
    "startJuz": 30
  },
  {
    "number": 82,
    "name": "سُورَةُ الانفِطَارِ",
    "englishName": "Al-Infitaar",
    "englishNameTranslation": "The Cleaving",
    "revelationType": "Meccan",
    "numberOfAyahs": 19,
    "startPage": 587,
    "startJuz": 30
  },
  {
    "number": 83,
    "name": "سُورَةُ المُطَفِّفِينَ",
    "englishName": "Al-Mutaffifin",
    "englishNameTranslation": "Defrauding",
    "revelationType": "Meccan",
    "numberOfAyahs": 36,
    "startPage": 587,
    "startJuz": 30
  },
  {
    "number": 84,
    "name": "سُورَةُ الانشِقَاقِ",
    "englishName": "Al-Inshiqaaq",
    "englishNameTranslation": "The Splitting Open",
    "revelationType": "Meccan",
    "numberOfAyahs": 25,
    "startPage": 589,
    "startJuz": 30
  },
  {
    "number": 85,
    "name": "سُورَةُ البُرُوجِ",
    "englishName": "Al-Burooj",
    "englishNameTranslation": "The Constellations",
    "revelationType": "Meccan",
    "numberOfAyahs": 22,
    "startPage": 590,
    "startJuz": 30
  },
  {
    "number": 86,
    "name": "سُورَةُ الطَّارِقِ",
    "englishName": "At-Taariq",
    "englishNameTranslation": "The Morning Star",
    "revelationType": "Meccan",
    "numberOfAyahs": 17,
    "startPage": 591,
    "startJuz": 30
  },
  {
    "number": 87,
    "name": "سُورَةُ الأَعۡلَىٰ",
    "englishName": "Al-A'laa",
    "englishNameTranslation": "The Most High",
    "revelationType": "Meccan",
    "numberOfAyahs": 19,
    "startPage": 591,
    "startJuz": 30
  },
  {
    "number": 88,
    "name": "سُورَةُ الغَاشِيَةِ",
    "englishName": "Al-Ghaashiya",
    "englishNameTranslation": "The Overwhelming",
    "revelationType": "Meccan",
    "numberOfAyahs": 26,
    "startPage": 592,
    "startJuz": 30
  },
  {
    "number": 89,
    "name": "سُورَةُ الفَجۡرِ",
    "englishName": "Al-Fajr",
    "englishNameTranslation": "The Dawn",
    "revelationType": "Meccan",
    "numberOfAyahs": 30,
    "startPage": 593,
    "startJuz": 30
  },
  {
    "number": 90,
    "name": "سُورَةُ البَلَدِ",
    "englishName": "Al-Balad",
    "englishNameTranslation": "The City",
    "revelationType": "Meccan",
    "numberOfAyahs": 20,
    "startPage": 594,
    "startJuz": 30
  },
  {
    "number": 91,
    "name": "سُورَةُ الشَّمۡسِ",
    "englishName": "Ash-Shams",
    "englishNameTranslation": "The Sun",
    "revelationType": "Meccan",
    "numberOfAyahs": 15,
    "startPage": 595,
    "startJuz": 30
  },
  {
    "number": 92,
    "name": "سُورَةُ اللَّيۡلِ",
    "englishName": "Al-Lail",
    "englishNameTranslation": "The Night",
    "revelationType": "Meccan",
    "numberOfAyahs": 21,
    "startPage": 595,
    "startJuz": 30
  },
  {
    "number": 93,
    "name": "سُورَةُ الضُّحَىٰ",
    "englishName": "Ad-Dhuhaa",
    "englishNameTranslation": "The Morning Hours",
    "revelationType": "Meccan",
    "numberOfAyahs": 11,
    "startPage": 596,
    "startJuz": 30
  },
  {
    "number": 94,
    "name": "سُورَةُ الشَّرۡحِ",
    "englishName": "Ash-Sharh",
    "englishNameTranslation": "The Consolation",
    "revelationType": "Meccan",
    "numberOfAyahs": 8,
    "startPage": 596,
    "startJuz": 30
  },
  {
    "number": 95,
    "name": "سُورَةُ التِّينِ",
    "englishName": "At-Tin",
    "englishNameTranslation": "The Fig",
    "revelationType": "Meccan",
    "numberOfAyahs": 8,
    "startPage": 597,
    "startJuz": 30
  },
  {
    "number": 96,
    "name": "سُورَةُ العَلَقِ",
    "englishName": "Al-Alaq",
    "englishNameTranslation": "The Clot",
    "revelationType": "Meccan",
    "numberOfAyahs": 19,
    "startPage": 597,
    "startJuz": 30
  },
  {
    "number": 97,
    "name": "سُورَةُ القَدۡرِ",
    "englishName": "Al-Qadr",
    "englishNameTranslation": "The Power, Fate",
    "revelationType": "Meccan",
    "numberOfAyahs": 5,
    "startPage": 598,
    "startJuz": 30
  },
  {
    "number": 98,
    "name": "سُورَةُ البَيِّنَةِ",
    "englishName": "Al-Bayyina",
    "englishNameTranslation": "The Evidence",
    "revelationType": "Medinan",
    "numberOfAyahs": 8,
    "startPage": 598,
    "startJuz": 30
  },
  {
    "number": 99,
    "name": "سُورَةُ الزَّلۡزَلَةِ",
    "englishName": "Az-Zalzala",
    "englishNameTranslation": "The Earthquake",
    "revelationType": "Medinan",
    "numberOfAyahs": 8,
    "startPage": 599,
    "startJuz": 30
  },
  {
    "number": 100,
    "name": "سُورَةُ العَادِيَاتِ",
    "englishName": "Al-Aadiyaat",
    "englishNameTranslation": "The Chargers",
    "revelationType": "Meccan",
    "numberOfAyahs": 11,
    "startPage": 599,
    "startJuz": 30
  },
  {
    "number": 101,
    "name": "سُورَةُ القَارِعَةِ",
    "englishName": "Al-Qaari'a",
    "englishNameTranslation": "The Calamity",
    "revelationType": "Meccan",
    "numberOfAyahs": 11,
    "startPage": 600,
    "startJuz": 30
  },
  {
    "number": 102,
    "name": "سُورَةُ التَّكَاثُرِ",
    "englishName": "At-Takaathur",
    "englishNameTranslation": "Competition",
    "revelationType": "Meccan",
    "numberOfAyahs": 8,
    "startPage": 600,
    "startJuz": 30
  },
  {
    "number": 103,
    "name": "سُورَةُ العَصۡرِ",
    "englishName": "Al-Asr",
    "englishNameTranslation": "The Declining Day, Epoch",
    "revelationType": "Meccan",
    "numberOfAyahs": 3,
    "startPage": 601,
    "startJuz": 30
  },
  {
    "number": 104,
    "name": "سُورَةُ الهُمَزَةِ",
    "englishName": "Al-Humaza",
    "englishNameTranslation": "The Traducer",
    "revelationType": "Meccan",
    "numberOfAyahs": 9,
    "startPage": 601,
    "startJuz": 30
  },
  {
    "number": 105,
    "name": "سُورَةُ الفِيلِ",
    "englishName": "Al-Fil",
    "englishNameTranslation": "The Elephant",
    "revelationType": "Meccan",
    "numberOfAyahs": 5,
    "startPage": 601,
    "startJuz": 30
  },
  {
    "number": 106,
    "name": "سُورَةُ قُرَيۡشٍ",
    "englishName": "Quraish",
    "englishNameTranslation": "Quraysh",
    "revelationType": "Meccan",
    "numberOfAyahs": 4,
    "startPage": 602,
    "startJuz": 30
  },
  {
    "number": 107,
    "name": "سُورَةُ المَاعُونِ",
    "englishName": "Al-Maa'un",
    "englishNameTranslation": "Almsgiving",
    "revelationType": "Meccan",
    "numberOfAyahs": 7,
    "startPage": 602,
    "startJuz": 30
  },
  {
    "number": 108,
    "name": "سُورَةُ الكَوۡثَرِ",
    "englishName": "Al-Kawthar",
    "englishNameTranslation": "Abundance",
    "revelationType": "Meccan",
    "numberOfAyahs": 3,
    "startPage": 602,
    "startJuz": 30
  },
  {
    "number": 109,
    "name": "سُورَةُ الكَافِرُونَ",
    "englishName": "Al-Kaafiroon",
    "englishNameTranslation": "The Disbelievers",
    "revelationType": "Meccan",
    "numberOfAyahs": 6,
    "startPage": 603,
    "startJuz": 30
  },
  {
    "number": 110,
    "name": "سُورَةُ النَّصۡرِ",
    "englishName": "An-Nasr",
    "englishNameTranslation": "Divine Support",
    "revelationType": "Medinan",
    "numberOfAyahs": 3,
    "startPage": 603,
    "startJuz": 30
  },
  {
    "number": 111,
    "name": "سُورَةُ المَسَدِ",
    "englishName": "Al-Masad",
    "englishNameTranslation": "The Palm Fibre",
    "revelationType": "Meccan",
    "numberOfAyahs": 5,
    "startPage": 603,
    "startJuz": 30
  },
  {
    "number": 112,
    "name": "سُورَةُ الإِخۡلَاصِ",
    "englishName": "Al-Ikhlaas",
    "englishNameTranslation": "Sincerity",
    "revelationType": "Meccan",
    "numberOfAyahs": 4,
    "startPage": 604,
    "startJuz": 30
  },
  {
    "number": 113,
    "name": "سُورَةُ الفَلَقِ",
    "englishName": "Al-Falaq",
    "englishNameTranslation": "The Dawn",
    "revelationType": "Meccan",
    "numberOfAyahs": 5,
    "startPage": 604,
    "startJuz": 30
  },
  {
    "number": 114,
    "name": "سُورَةُ النَّاسِ",
    "englishName": "An-Naas",
    "englishNameTranslation": "Mankind",
    "revelationType": "Meccan",
    "numberOfAyahs": 6,
    "startPage": 604,
    "startJuz": 30
  }
];

export const JUZ_INDEX: JuzEntry[] = [
  {
    "juz": 1,
    "surah": 1,
    "ayah": 1,
    "page": 1,
    "surahName": "Al-Faatiha"
  },
  {
    "juz": 2,
    "surah": 2,
    "ayah": 142,
    "page": 22,
    "surahName": "Al-Baqara"
  },
  {
    "juz": 3,
    "surah": 2,
    "ayah": 253,
    "page": 42,
    "surahName": "Al-Baqara"
  },
  {
    "juz": 4,
    "surah": 3,
    "ayah": 93,
    "page": 62,
    "surahName": "Aal-i-Imraan"
  },
  {
    "juz": 5,
    "surah": 4,
    "ayah": 24,
    "page": 82,
    "surahName": "An-Nisaa"
  },
  {
    "juz": 6,
    "surah": 4,
    "ayah": 148,
    "page": 102,
    "surahName": "An-Nisaa"
  },
  {
    "juz": 7,
    "surah": 5,
    "ayah": 82,
    "page": 121,
    "surahName": "Al-Maaida"
  },
  {
    "juz": 8,
    "surah": 6,
    "ayah": 111,
    "page": 142,
    "surahName": "Al-An'aam"
  },
  {
    "juz": 9,
    "surah": 7,
    "ayah": 88,
    "page": 162,
    "surahName": "Al-A'raaf"
  },
  {
    "juz": 10,
    "surah": 8,
    "ayah": 41,
    "page": 182,
    "surahName": "Al-Anfaal"
  },
  {
    "juz": 11,
    "surah": 9,
    "ayah": 93,
    "page": 201,
    "surahName": "At-Tawba"
  },
  {
    "juz": 12,
    "surah": 11,
    "ayah": 6,
    "page": 222,
    "surahName": "Hud"
  },
  {
    "juz": 13,
    "surah": 12,
    "ayah": 53,
    "page": 242,
    "surahName": "Yusuf"
  },
  {
    "juz": 14,
    "surah": 15,
    "ayah": 1,
    "page": 262,
    "surahName": "Al-Hijr"
  },
  {
    "juz": 15,
    "surah": 17,
    "ayah": 1,
    "page": 282,
    "surahName": "Al-Israa"
  },
  {
    "juz": 16,
    "surah": 18,
    "ayah": 75,
    "page": 302,
    "surahName": "Al-Kahf"
  },
  {
    "juz": 17,
    "surah": 21,
    "ayah": 1,
    "page": 322,
    "surahName": "Al-Anbiyaa"
  },
  {
    "juz": 18,
    "surah": 23,
    "ayah": 1,
    "page": 342,
    "surahName": "Al-Muminoon"
  },
  {
    "juz": 19,
    "surah": 25,
    "ayah": 21,
    "page": 362,
    "surahName": "Al-Furqaan"
  },
  {
    "juz": 20,
    "surah": 27,
    "ayah": 56,
    "page": 382,
    "surahName": "An-Naml"
  },
  {
    "juz": 21,
    "surah": 29,
    "ayah": 46,
    "page": 402,
    "surahName": "Al-Ankaboot"
  },
  {
    "juz": 22,
    "surah": 33,
    "ayah": 31,
    "page": 422,
    "surahName": "Al-Ahzaab"
  },
  {
    "juz": 23,
    "surah": 36,
    "ayah": 28,
    "page": 442,
    "surahName": "Yaseen"
  },
  {
    "juz": 24,
    "surah": 39,
    "ayah": 32,
    "page": 462,
    "surahName": "Az-Zumar"
  },
  {
    "juz": 25,
    "surah": 41,
    "ayah": 47,
    "page": 482,
    "surahName": "Fussilat"
  },
  {
    "juz": 26,
    "surah": 46,
    "ayah": 1,
    "page": 502,
    "surahName": "Al-Ahqaf"
  },
  {
    "juz": 27,
    "surah": 51,
    "ayah": 31,
    "page": 522,
    "surahName": "Adh-Dhaariyat"
  },
  {
    "juz": 28,
    "surah": 58,
    "ayah": 1,
    "page": 542,
    "surahName": "Al-Mujaadila"
  },
  {
    "juz": 29,
    "surah": 67,
    "ayah": 1,
    "page": 562,
    "surahName": "Al-Mulk"
  },
  {
    "juz": 30,
    "surah": 78,
    "ayah": 1,
    "page": 582,
    "surahName": "An-Naba"
  }
];

export const STARTER_SURAHS: Record<number, SurahData> = {
  "1": {
    "number": 1,
    "name": "سُورَةُ ٱلْفَاتِحَةِ",
    "englishName": "Al-Faatiha",
    "englishNameTranslation": "The Opening",
    "revelationType": "Meccan",
    "ayahs": [
      {
        "n": 1,
        "p": 1,
        "j": 1,
        "ar": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        "hg": "Allah ke naam se jo Rehman wa Raheem hai.",
        "hi": "अल्लाह के नाम से जो रहमान व रहीम है।",
        "tr": "Bismillaahir Rahmaanir Raheem"
      },
      {
        "n": 2,
        "p": 1,
        "j": 1,
        "ar": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
        "hg": "Taareef Allah hi ke liye hai jo tamaam kainaat ka Rabb hai.",
        "hi": "तारीफ़ अल्लाह ही के लिये है जो तमाम क़ायनात का रब है।",
        "tr": "Alhamdu lillaahi Rabbil 'aalameen"
      },
      {
        "n": 3,
        "p": 1,
        "j": 1,
        "ar": "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        "hg": "Rehman aur Raheem hai.",
        "hi": "रहमान और रहीम है।",
        "tr": "Ar-Rahmaanir-Raheem"
      },
      {
        "n": 4,
        "p": 1,
        "j": 1,
        "ar": "مَٰلِكِ يَوْمِ ٱلدِّينِ",
        "hg": "Roz-e jaza ka maalik hai.",
        "hi": "रोज़े जज़ा का मालिक है।",
        "tr": "Maaliki Yawmid-Deen"
      },
      {
        "n": 5,
        "p": 1,
        "j": 1,
        "ar": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        "hg": "Hum teri hi ibaadat karte hain, aur tujh hi se madad maangte hai.",
        "hi": "हम तेरी ही इबादत करते हैं, और तुझ ही से मदद मांगते है।",
        "tr": "Iyyaaka na'budu wa lyyaaka nasta'een"
      },
      {
        "n": 6,
        "p": 1,
        "j": 1,
        "ar": "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
        "hg": "Hamein seedha raasta dikha.",
        "hi": "हमें सीधा रास्ता दिखा।",
        "tr": "Ihdinas-Siraatal-Mustaqeem"
      },
      {
        "n": 7,
        "p": 1,
        "j": 1,
        "ar": "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
        "hg": "Un logon ka raasta jin par toone inaam farmaya, jo maaatoob nahi hue, jo bhatke hue nahi hai.",
        "hi": "उन लोगों का रास्ता जिन पर तूने इनाम फ़रमाया, जो माअतूब नहीं हुए, जो भटके हुए नहीं है।",
        "tr": "Siraatal-lazeena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daaalleen"
      }
    ]
  },
  "2": {
    "number": 2,
    "name": "سُورَةُ البَقَرَةِ",
    "englishName": "Al-Baqara",
    "englishNameTranslation": "The Cow",
    "revelationType": "Medinan",
    "ayahs": [
      {
        "n": 1,
        "p": 2,
        "j": 1,
        "ar": "الٓمٓ",
        "hg": "Alif Laam Meem",
        "hi": "अलीफ़ लाम मीम",
        "tr": "Alif-Laaam-Meeem"
      },
      {
        "n": 2,
        "p": 2,
        "j": 1,
        "ar": "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ",
        "hg": "(Ye) woh kitaab hai. jis (ke kitaab-e Khuda hone) mein kuch bhi shak nahi (ye) parhezgaaron ki rehnuma hai",
        "hi": "(ये) वह किताब है। जिस (के किताबे खुदा होने) में कुछ भी शक नहीं (ये) परहेज़गारों की रहनुमा है",
        "tr": "Zaalikal Kitaabu laa raiba feeh; udal lilmuttaqeen"
      },
      {
        "n": 3,
        "p": 2,
        "j": 1,
        "ar": "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ",
        "hg": "Jo ghaib par imaan laate hain aur (paabandi se) namaaz adaa karte hain aur jo kuch humne unko diya hai usmein se (raahe Khuda mein) kharch karte hain",
        "hi": "जो ग़ैब पर ईमान लाते हैं और (पाबन्दी से) नमाज़ अदा करते हैं और जो कुछ हमने उनको दिया है उसमें से (राहे खुदा में) ख़र्च करते हैं",
        "tr": "Allazeena yu'minoona bilghaibi wa yuqeemoonas salaata wa mimmaa razaqnaahum yunfiqoon"
      },
      {
        "n": 4,
        "p": 2,
        "j": 1,
        "ar": "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْءَاخِرَةِ هُمْ يُوقِنُونَ",
        "hg": "Aur jo kuch tum par (ai Rasool) aur tum se pehle naazil kiya gaya hai us par imaan laate hain aur wahi aakhirat ka yaqeen bhi rakhte hain",
        "hi": "और जो कुछ तुम पर (ऐ रसूल) और तुम से पहले नाज़िल किया गया है उस पर ईमान लाते हैं और वही आख़िरत का यक़ीन भी रखते हैं",
        "tr": "Wallazeena yu'minoona bimaa unzila ilaika wa maaa unzila min qablika wa bil Aakhirati hum yooqinoon"
      },
      {
        "n": 5,
        "p": 2,
        "j": 1,
        "ar": "أُو۟لَٰٓئِكَ عَلَىٰ هُدًۭى مِّن رَّبِّهِمْ ۖ وَأُو۟لَٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ",
        "hg": "Yahi log apne parawardigaar ki hidayat par (aamil) hain aur yahi log apni dili muraaden paaenge",
        "hi": "यही लोग अपने परवरदिगार की हिदायत पर (आमिल) हैं और यही लोग अपनी दिली मुरादें पाएँगे",
        "tr": "Ulaaa'ika 'alaa hudam mir rabbihim wa ulaaa'ika humul muflihoon"
      },
      {
        "n": 6,
        "p": 3,
        "j": 1,
        "ar": "إِنَّ ٱلَّذِينَ كَفَرُوا۟ سَوَآءٌ عَلَيْهِمْ ءَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
        "hg": "Beshak jin logon ne kufr ikhteyaar kiya unke liye baraabar hai (ai Rasool) khwaah (chaahe) tum unhen daraao ya na daraao woh imaan na laaenge",
        "hi": "बेशक जिन लोगों ने कुफ़्र इख़तेयार किया उनके लिए बराबर है (ऐ रसूल) ख्वाह (चाहे) तुम उन्हें डराओ या न डराओ वह ईमान न लाएँगे",
        "tr": "Innal lazeena kafaroo sawaaa'un 'alaihim 'a-anzar tahum am lam tunzirhum laa yu'minoon"
      },
      {
        "n": 7,
        "p": 3,
        "j": 1,
        "ar": "خَتَمَ ٱللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰٓ أَبْصَٰرِهِمْ غِشَٰوَةٌۭ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌۭ",
        "hg": "Unke dilon par aur unke kaanon par (nazar karke) Khuda ne tasdiq kar di hai (ke ye imaan na laaenge) aur unki onkhon par parda (para huaa) hai aur unhin ke liye (bahut) bara azaab hai",
        "hi": "उनके दिलों पर और उनके कानों पर (नज़र करके) खुदा ने तसदीक़ कर दी है (कि ये ईमान न लाएँगे) और उनकी ऑंखों पर परदा (पड़ा हुआ) है और उन्हीं के लिए (बहुत) बड़ा अज़ाब है",
        "tr": "Khatamal laahu 'alaa quloobihim wa 'alaa sam'i-him wa 'alaaa absaarihim ghishaa watunw wa lahum 'azaabun 'azeem"
      },
      {
        "n": 8,
        "p": 3,
        "j": 1,
        "ar": "وَمِنَ ٱلنَّاسِ مَن يَقُولُ ءَامَنَّا بِٱللَّهِ وَبِٱلْيَوْمِ ٱلْءَاخِرِ وَمَا هُم بِمُؤْمِنِينَ",
        "hg": "Aur baaz log aise bhi hain jo (zabaan se toh) kehte hain ke hum Khuda par aur qayaamat par imaan laae haalaanki woh dil se imaan nahi laae",
        "hi": "और बाज़ लोग ऐसे भी हैं जो (ज़बान से तो) कहते हैं कि हम खुदा पर और क़यामत पर ईमान लाए हालाँकि वह दिल से ईमान नहीं लाए",
        "tr": "Wa minan naasi mai yaqoolu aamannaa billaahi wa bil yawmil aakhiri wa maa hum bimu'mineen"
      },
      {
        "n": 9,
        "p": 3,
        "j": 1,
        "ar": "يُخَٰدِعُونَ ٱللَّهَ وَٱلَّذِينَ ءَامَنُوا۟ وَمَا يَخْدَعُونَ إِلَّآ أَنفُسَهُمْ وَمَا يَشْعُرُونَ",
        "hg": "Khuda ko aur un logon ko jo imaan laae dhokha dete hain haalaanki woh apne aapko dhokha dete hain aur kuch shaoor nahi rakhte hain",
        "hi": "खुदा को और उन लोगों को जो ईमान लाए धोखा देते हैं हालाँकि वह अपने आपको धोखा देते हैं और कुछ शऊर नहीं रखते हैं",
        "tr": "Yukhaadi'oonal laaha wallazeena aamanoo wa maa yakhda'oona illaaa anfusahum wa maa yash'uroon"
      },
      {
        "n": 10,
        "p": 3,
        "j": 1,
        "ar": "فِى قُلُوبِهِم مَّرَضٌۭ فَزَادَهُمُ ٱللَّهُ مَرَضًۭا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌۢ بِمَا كَانُوا۟ يَكْذِبُونَ",
        "hg": "Unke dilon mein marz tha hi ab Khuda ne unke marz ko aur barha diya aur choonki woh log jhooth bola karte the islie un par takliph deh azaab hai",
        "hi": "उनके दिलों में मर्ज़ था ही अब खुदा ने उनके मर्ज़ को और बढ़ा दिया और चूँकि वह लोग झूठ बोला करते थे इसलिए उन पर तकलीफ देह अज़ाब है",
        "tr": "Fee quloobihim mara dun fazzdahumul laahu maradan wa lahum 'azaabun aleemum bimaa kaanoo yakziboon"
      },
      {
        "n": 11,
        "p": 3,
        "j": 1,
        "ar": "وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا۟ فِى ٱلْأَرْضِ قَالُوٓا۟ إِنَّمَا نَحْنُ مُصْلِحُونَ",
        "hg": "Aur jab unse kaha jaata hai ke mulk mein phasaad na karte phiro (toh) kehte hain ke hum toh sirf islaah karte hain",
        "hi": "और जब उनसे कहा जाता है कि मुल्क में फसाद न करते फिरो (तो) कहते हैं कि हम तो सिर्फ इसलाह करते हैं",
        "tr": "Wa izaa qeela lahum laa tufsidoo fil ardi qaalo innamaa nahnu muslihoon"
      },
      {
        "n": 12,
        "p": 3,
        "j": 1,
        "ar": "أَلَآ إِنَّهُمْ هُمُ ٱلْمُفْسِدُونَ وَلَٰكِن لَّا يَشْعُرُونَ",
        "hg": "Khabardaar ho jaao beshak yahi log phasaadi hain lekin samajhte nahi",
        "hi": "ख़बरदार हो जाओ बेशक यही लोग फसादी हैं लेकिन समझते नहीं",
        "tr": "Alaaa innahum humul mufsidoona wa laakil laa yash'uroon"
      },
      {
        "n": 13,
        "p": 3,
        "j": 1,
        "ar": "وَإِذَا قِيلَ لَهُمْ ءَامِنُوا۟ كَمَآ ءَامَنَ ٱلنَّاسُ قَالُوٓا۟ أَنُؤْمِنُ كَمَآ ءَامَنَ ٱلسُّفَهَآءُ ۗ أَلَآ إِنَّهُمْ هُمُ ٱلسُّفَهَآءُ وَلَٰكِن لَّا يَعْلَمُونَ",
        "hg": "Aur jab unse kaha jaata hai ke jis tarah aur log imaan laae hain tum bhi imaan laao toh kehte hain kya hum bhi usi tarah imaan laaen jis tarah aur bewkoof log imaan laaen, khabardaar ho jaao log bewqoof hain lekin nahi jaante",
        "hi": "और जब उनसे कहा जाता है कि जिस तरह और लोग ईमान लाए हैं तुम भी ईमान लाओ तो कहते हैं क्या हम भी उसी तरह ईमान लाएँ जिस तरह और बेवकूफ़ लोग ईमान लाएँ, ख़बरदार हो जाओ लोग बेवक़ूफ़ हैं लेकिन नहीं जानते",
        "tr": "Wa izaa qeela lahum aaminoo kamaaa aamanan naasu qaalooo anu'minu kamaaa aamanas sufahaaa'; alaaa innahum humus sufahaaa'u wa laakil laa ya'lamoon"
      },
      {
        "n": 14,
        "p": 3,
        "j": 1,
        "ar": "وَإِذَا لَقُوا۟ ٱلَّذِينَ ءَامَنُوا۟ قَالُوٓا۟ ءَامَنَّا وَإِذَا خَلَوْا۟ إِلَىٰ شَيَٰطِينِهِمْ قَالُوٓا۟ إِنَّا مَعَكُمْ إِنَّمَا نَحْنُ مُسْتَهْزِءُونَ",
        "hg": "Aur jab un logon se milte hain jo imaan la chuke toh kehte hain hum toh imaan la chuke aur jab apne shaitaanon ke saath tanha rah jaate hain toh kehte hain hum tumhare saath hain hum toh (musalmaanon ko) banaate hain",
        "hi": "और जब उन लोगों से मिलते हैं जो ईमान ला चुके तो कहते हैं हम तो ईमान ला चुके और जब अपने शैतानों के साथ तनहा रह जाते हैं तो कहते हैं हम तुम्हारे साथ हैं हम तो (मुसलमानों को) बनाते हैं",
        "tr": "Wa izaa laqul lazeena aamanoo qaalooo aamannaa wa izaa khalw ilaa shayaateenihim qaalooo innaa ma'akum innamaa nahnu mustahzi'oon"
      },
      {
        "n": 15,
        "p": 3,
        "j": 1,
        "ar": "ٱللَّهُ يَسْتَهْزِئُ بِهِمْ وَيَمُدُّهُمْ فِى طُغْيَٰنِهِمْ يَعْمَهُونَ",
        "hg": "(Woh kya banaaenge) Khuda unko banaata hai aur unko dhil deta hai ke woh apni sarakshi mein ghalat pechaan (uljhe) rahen",
        "hi": "(वह क्या बनाएँगे) खुदा उनको बनाता है और उनको ढील देता है कि वह अपनी सरकशी में ग़लत पेचाँ (उलझे) रहें",
        "tr": "Allahu yastahzi'u bihim wa yamudduhum fee tughyaanihim ya'mahoon"
      }
    ]
  },
  "112": {
    "number": 112,
    "name": "سُورَةُ الإِخۡلَاصِ",
    "englishName": "Al-Ikhlaas",
    "englishNameTranslation": "Sincerity",
    "revelationType": "Meccan",
    "ayahs": [
      {
        "n": 1,
        "p": 604,
        "j": 30,
        "ar": "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
        "hg": "(Ai Rasool) tum kah do ke khuda ek hai",
        "hi": "(ऐ रसूल) तुम कह दो कि ख़ुदा एक है",
        "tr": "Qul huwal laahu ahad"
      },
      {
        "n": 2,
        "p": 604,
        "j": 30,
        "ar": "ٱللَّهُ ٱلصَّمَدُ",
        "hg": "Khuda barhaq beniyaaz hai",
        "hi": "ख़ुदा बरहक़ बेनियाज़ है",
        "tr": "Allah hus-samad"
      },
      {
        "n": 3,
        "p": 604,
        "j": 30,
        "ar": "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        "hg": "Na usne kisi ko jana na usko kisi ne jana,",
        "hi": "न उसने किसी को जना न उसको किसी ने जना,",
        "tr": "Lam yalid wa lam yoolad"
      },
      {
        "n": 4,
        "p": 604,
        "j": 30,
        "ar": "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
        "hg": "Aur uska koi hamsar nahi",
        "hi": "और उसका कोई हमसर नहीं",
        "tr": "Wa lam yakul-lahu kufuwan ahad"
      }
    ]
  },
  "113": {
    "number": 113,
    "name": "سُورَةُ الفَلَقِ",
    "englishName": "Al-Falaq",
    "englishNameTranslation": "The Dawn",
    "revelationType": "Meccan",
    "ayahs": [
      {
        "n": 1,
        "p": 604,
        "j": 30,
        "ar": "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
        "hg": "(Ai Rasool) tum kah do ke main subah ke maalik ki",
        "hi": "(ऐ रसूल) तुम कह दो कि मैं सुबह के मालिक की",
        "tr": "Qul a'uzoo bi rabbil-falaq"
      },
      {
        "n": 2,
        "p": 604,
        "j": 30,
        "ar": "مِن شَرِّ مَا خَلَقَ",
        "hg": "Har chiz ki buraaee se jo usne paida ki panaah maangta hoon",
        "hi": "हर चीज़ की बुराई से जो उसने पैदा की पनाह माँगता हूँ",
        "tr": "Min sharri ma khalaq"
      },
      {
        "n": 3,
        "p": 604,
        "j": 30,
        "ar": "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        "hg": "Aur andheriraat ki buraaee se jab uska andhera chha jaae",
        "hi": "और अंधेरीरात की बुराई से जब उसका अंधेरा छा जाए",
        "tr": "Wa min sharri ghasiqin iza waqab"
      },
      {
        "n": 4,
        "p": 604,
        "j": 30,
        "ar": "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ",
        "hg": "Aur gandon par phoonkne waaliyon ki buraaee se",
        "hi": "और गन्डों पर फूँकने वालियों की बुराई से",
        "tr": "Wa min sharrin-naffaa-thaati fil 'uqad"
      },
      {
        "n": 5,
        "p": 604,
        "j": 30,
        "ar": "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        "hg": "(Jab phoonke) aur hasad karne waale ki buraaee se",
        "hi": "(जब फूँके) और हसद करने वाले की बुराई से",
        "tr": "Wa min shar ri haasidin iza hasad"
      }
    ]
  },
  "114": {
    "number": 114,
    "name": "سُورَةُ النَّاسِ",
    "englishName": "An-Naas",
    "englishNameTranslation": "Mankind",
    "revelationType": "Meccan",
    "ayahs": [
      {
        "n": 1,
        "p": 604,
        "j": 30,
        "ar": "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
        "hg": "(Ai Rasool) tum kah do main logon ke parawardigaar",
        "hi": "(ऐ रसूल) तुम कह दो मैं लोगों के परवरदिगार",
        "tr": "Qul a'uzu birabbin naas"
      },
      {
        "n": 2,
        "p": 604,
        "j": 30,
        "ar": "مَلِكِ ٱلنَّاسِ",
        "hg": "Logon ke baadshaah",
        "hi": "लोगों के बादशाह",
        "tr": "Malikin naas"
      },
      {
        "n": 3,
        "p": 604,
        "j": 30,
        "ar": "إِلَٰهِ ٱلنَّاسِ",
        "hg": "Logon ke maabood ki (shaitaani)",
        "hi": "लोगों के माबूद की (शैतानी)",
        "tr": "Ilaahin naas"
      },
      {
        "n": 4,
        "p": 604,
        "j": 30,
        "ar": "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",
        "hg": "Wasawse ki buraaee se panaah maangta hoon",
        "hi": "वसवसे की बुराई से पनाह माँगता हूँ",
        "tr": "Min sharril was waasil khannaas"
      },
      {
        "n": 5,
        "p": 604,
        "j": 30,
        "ar": "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ",
        "hg": "Jo (khuda ke naam se) pichhe hat jaata hai jo logon ke dilon mein wasawse daala karta hai",
        "hi": "जो (ख़ुदा के नाम से) पीछे हट जाता है जो लोगों के दिलों में वसवसे डाला करता है",
        "tr": "Al lazee yuwas wisu fee sudoorin naas"
      },
      {
        "n": 6,
        "p": 604,
        "j": 30,
        "ar": "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
        "hg": "Jinnaat mein se khwaah aadmiyon mein se",
        "hi": "जिन्नात में से ख्वाह आदमियों में से",
        "tr": "Minal jinnati wan naas"
      }
    ]
  }
};
