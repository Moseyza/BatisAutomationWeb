import moment from 'moment';
import * as persianDate from 'persian-date'

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
        return `${this.minutes} دقیقه پیش`;
    }
}

class HourseAgoResult extends Result{
    hours = 0;
    minutes = 0;
    toString(){
        if(this.minutes === 0)
            return `${this.hours} ساعت پیش`;
        return `${this.hours} ساعت و ${this.minutes} دقیقه پیش`;
    }
}

class YesterdayReslt extends Result{
    hour = 0;
    minute = 0;
    toString(){
            return `دیروز ساعت ${this.hour}:${this.minute}`;
    }
}

class TodayResult extends Result{
    hour = 0;
    minute = 0;
    toString(){
        return `امروز ساعت ${this.hour}:${this.minute}`;
    }
}

class WeekResult extends Result{
    dayOfWeekName = '';
    daysAgo = '';
    hour = 0;
    minute = 0 ;
    toString(){
        return `${this.dayOfWeekName} ساعت ${this.hour}:${this.minute}`;
    }
}

export class DateConverter{
    dateTimeNow = ()=> new Date();
    convertToString(date: Date,now: Date,title = ''){
        if(now === new Date())
            now = this.dateTimeNow();
        const nowPersian = new persianDate(now)
        const datePersian = new persianDate(date);
        const elapsedTime =  datePersian.diff(nowPersian);
        const dayDifference = datePersian.diff(nowPersian,'days');
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

        function isInSameWeek(pd1: any ,pd2: any){
			if(pd1.isSameDay(pd2)) return true;
			//if(!pd1.isSameMonth(pd2))return false;
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
            
    }

}

export class DateBaseOnCurrentTimeConverter{
  
    getDateString(d: Date,title: string)
    {
        const dateConverter = new DateConverter();
        const result =   dateConverter.convertToString(d, new Date(),title);
        console.log(title);
        console.log(result);
        console.log("***************");
        if(result)
        return result.toString();
        return '';
    }
}