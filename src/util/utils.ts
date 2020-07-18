import * as persianDate from 'persian-date';
export function getNewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}


export function getPersianDate(date: string,format: string, formatPersian = true){
      //const persianDate =  require('@/../public/persian-date.js');
      const pd = new persianDate(new Date(date));
      pd.formatPersian = formatPersian;
      return pd.format(format);
  
}

export function getPersianFullFormatDate(date: string){
  //const persianDate =  require('@/../public/persian-date.js');
      const pd = new persianDate(new Date(date.substring(0,date.length -1)));
      return pd.format("dddd DD MMMM  YYYY ساعت HH:mm ");
}

export function converBase64toBlob(content: string, contentType: string) {
  contentType = contentType || '';
  const sliceSize = 512;
  const byteCharacters = window.atob(content); //method which converts base64 to binary
  const byteArrays = [
  ];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, {
    type: contentType
  }); //statement which creates the blob
  return blob;
}


  
  export function saveFile(data: Blob, fileName: string) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    const    url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

export function GetFileUrl(data: Blob, fileName: string)
{
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  const    url = window.URL.createObjectURL(data);
  return url;
}

export function base64RemovePrefix(base64: any) {
  base64 = (base64 as string).substring((base64 as string).indexOf(',')+1);
  return base64;
  // alert(base64);
  // const binaryString = window.atob(base64);
  // const len = binaryString.length;
  // const bytes = new Uint8Array(len);
  // for (let i = 0; i < len; i++) {
  //     bytes[i] = binaryString.charCodeAt(i);
  // }
  // return bytes.buffer;
}

export function replaceChars(inputStr: string): string{
        
  inputStr = inputStr.replace(/ي/g, "ی");
  inputStr = inputStr.replace(/ۍ/g, "ی");
  inputStr = inputStr.replace(/ێ/g, "ی");
  inputStr = inputStr.replace(/ۑ/g, "ی");
  inputStr = inputStr.replace(/ې/g, "ی");
  inputStr = inputStr.replace(/ك/g, "ک");
  inputStr = inputStr.replace(/ګ/g, "ک");
  inputStr = inputStr.replace(/ڬ/g, "ک");
  inputStr = inputStr.replace(/ڇ/g, "چ");
   return inputStr;
}