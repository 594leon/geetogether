import { Gender, ZodiacSign } from "@serjin/common";

//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
interface Profile {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    // zodiacSign: 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';
    zodiacSign: ZodiacSign;
    myTags: string[];
    avatar: string;
    version: number;
}

export { Profile }