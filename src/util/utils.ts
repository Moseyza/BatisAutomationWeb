export function getNewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}


export function getPersianDate(date: string,format: string){
  if(format === 'MM/DD'){
      const persianDate =  require('@/../public/persian-date.js');
      const pd = new persianDate(new Date(date));
      //return `${pd.month()}/${pd.day()}`;
      return pd.format("MM/DD");
  }
  return '';
}