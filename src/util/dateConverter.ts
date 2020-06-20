import moment from 'moment';
import * as persianDate from 'persian-date';

class Result 
{
    toString(){
        return '56565';
    }
}
class NowResult extends Result{
    toString(){
        return 'هم اکنون';
        
    }
}

class MinutesAgoResult extends Result{
    minutes = 0;
    toString(){
        return `${this.minutes.toString().padStart(2,"0")} دقیقه پیش`;
    }
}

class HourseAgoResult extends Result{
    hours = 0;
    minutes = 0;
    toString(){
        if(this.minutes === 0)
            return `${this.hours.toString().padStart(2,"")} ساعت پیش`;
        return `${this.hours} ساعت و ${this.minutes.toString().padStart(2,"0")} دقیقه پیش`;
    }
}

class YesterdayReslt extends Result{
    hour = 0;
    minute = 0;
    toString(){
            return `دیروز ساعت ${this.hour.toString().padStart(2,"0")}:${this.minute.toString().padStart(2,"0")}`;
    }
}

class TodayResult extends Result{
    hour = 0;
    minute = 0;
    toString(){
        return `امروز ساعت ${this.hour.toString().padStart(2,"0")}:${this.minute.toString().padStart(2,"0")}`;
    }
}

class WeekResult extends Result{
    dayOfWeekName = '';
    daysAgo = '';
    hour = 0;
    minute = 0 ;
    toString(){
        return `${this.dayOfWeekName} ساعت ${this.hour.toString().padStart(2,"0")}:${this.minute.toString().padStart(2,"0")}`;
    }
}

class MonthWithNoYearResult extends Result{
    daysAgo = '';
    month = '';
    day = '';
    monthName = '';
    toString(){
        return `${this.day} ${this.monthName} (${this.daysAgo} روز پیش)`;
    }
}

class YearsMonthDayResult extends Result{
    year = 0;
    month = 0;
    day = 0;
    monthName = '';
    toString(){
        return `${this.year}/${this.month}/${this.day}`
    }
}

export class DateConverter{
    dateTimeNow = ()=> new Date();
    convertToString(date: Date,now: Date){
        if(now === new Date())
            now = this.dateTimeNow();
        
        const nowPersian =  new persianDate(now)
        const datePersian = new  persianDate(date);
        const elapsedTime =  nowPersian.diff(datePersian);
        const dayDifference = nowPersian.diff(datePersian,'days');
        const epsilon = 0.0001;
        const threeHour = 10800000;
        const oneHour =    3600000;
        const oneMinute = 60000;
        if(elapsedTime < oneMinute)
            return new NowResult();
        if(elapsedTime < oneHour){
            const result =  new MinutesAgoResult();
            result.minutes = parseInt((elapsedTime/60000).toString());
            return result;
        }
        if(elapsedTime <= threeHour){
            const result = new HourseAgoResult();
            result.hours = parseInt((elapsedTime/3600000).toString());
            result.minutes = parseInt(((elapsedTime % 3600000)/60000).toString());
            return result;
        }
        if(datePersian.isSameDay(nowPersian) ){//isToday        
            const result = new TodayResult();
            result.hour = parseInt(datePersian.toLocale('en').format('H'));
            result.minute = parseInt(datePersian.toLocale('en').format('m'));
            return result;

        }
        if(dayDifference === 1){//isYesterday
            const result = new YesterdayReslt();
            result.minute = parseInt(datePersian.toLocale('en').format('m'));
            result.hour =  parseInt(datePersian.toLocale('en').format('H'));
            return result;
        }
        if(this.isInSameYear(datePersian,nowPersian) && this.isInSameWeek(datePersian,nowPersian)){
            const result = new WeekResult();
            result.daysAgo = dayDifference;
            result.dayOfWeekName = this.getDayOfWeekName(datePersian.day());
            result.minute = parseInt(datePersian.toLocale('en').format('m'));
            result.hour =  parseInt(datePersian.toLocale('en').format('H'));
            return result;

        }
        if(this.isInSameYear(datePersian,nowPersian)){
            const result = new MonthWithNoYearResult();
            result.day = datePersian.date();
            result.daysAgo = dayDifference;
            result.monthName = this.getMonthName(datePersian.month());
            return result;
        }
        const result = new YearsMonthDayResult();
        result.day = datePersian.date();
        result.month = datePersian.month();
        result.year = datePersian.year();
        return result;
    }
    isInSameWeek(pd1: any ,pd2: any){
        if(pd1.isSameDay(pd2)) return true;
        if(pd1.day() === pd2.day()) return false;
        let p1 = {} as any;
        let p2 = {} as any;
        if(pd1.unix()>=pd2.unix()){
            p1 = pd2;
            p2 = pd1;
        }
        else{
            p1 = pd1;
            p2 = pd2;
        }
        if(!p1 || !p2 ) return;
        if(p2.day() < p1.day())return false;
        const dayDiff = p2.day() - p1.day();
        const tempDate = p1.add('days',dayDiff);
        if(tempDate.unix() === p2.unix()){
            return true;
        }
        return false;
    }

    isInSameYear(pd1: any, pd2: any){
        return pd1.year() === pd2.year();
    }
    getDayOfWeekName(day: number){
        switch(day){
            case 1: return 'شنبه';
            case 2: return 'یکشنبه';
            case 3: return 'دوشنبه';
            case 4: return 'سه شنبه';
            case 5: return 'چهارشنبه';
            case 6: return 'پنج شنبه';
            case 7: return 'جمعه';
        }
        return '';
    }
    getMonthName(month: number){
        switch(month){
            case 1: return 'فروردین';
            case 2: return 'اردیبهشت';
            case 3: return 'خرداد';
            case 4: return 'تیر';
            case 5: return 'مرداد';
            case 6: return 'شهریور';
            case 7: return 'مهر';
            case 8: return 'آبان';
            case 9: return 'آذر';
            case 10: return 'دی';
            case 11: return 'بهمن';
            case 12: return 'اسفند';
        }
        return '';
    }
}   

export class DateBaseOnCurrentTimeConverter{
  
    getDateString(d: Date)
    {
        const dateConverter = new DateConverter();
        const result =   dateConverter.convertToString(d, new Date());
        // console.log(title);
        // console.log(result);
        // console.log("***************");
        if(result)
        return result.toString();
        return '';
    }
}