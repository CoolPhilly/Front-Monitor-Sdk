
export default function uuid(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const txt = 'test';
    ctx?.fillText(txt, 10, 10)    
    return canvas.toDataURL()
} 