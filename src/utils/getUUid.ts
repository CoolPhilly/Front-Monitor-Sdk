import { Md5 } from 'ts-md5';

export default function uuid(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const txt = 'uuid';
    ctx?.fillText(txt, 10, 10)    
     
    return Md5.hashStr(canvas.toDataURL())
} 