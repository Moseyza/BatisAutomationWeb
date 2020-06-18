import moment from 'moment';
export class DateBaseOnCurrentTimeConverter{
    test(){
        const t = new NowResult();
        
    }
}

class Result 
{
    
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
    convertToString(date: Date,now: Date){
        if(now === new Date())
            now = this.dateTimeNow();
        const nowMoment = moment(now);
        const dateMoment = moment(date);
        const elapsedTime =  nowMoment.diff(dateMoment);
        const dayDifference = nowMoment.diff(dateMoment,'day');
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
        if(dayDifference == 0 ){//isToday        
            const result = new TodayResult();
            result.hour = parseInt((elapsedTime/3600000).toString());
            result.minute = parseInt(((elapsedTime % 3600000)/60000).toString());
            return result;

        }
        if(dayDifference - 1 >=0){//isYesterday
            const result = new YesterdayReslt();
            //result.minute = 
        }
            
    }

}