import circle from './circle.svg';
import android from './android.svg';

export function draw(c, img, f) {
    const ctx=c.getContext('2d');
    try {
        if(typeof(f.width)==='number') {
            c.width=f.width;
            img.width=f.width;
        }
        if(typeof(f.height)==='number') {
            c.height=f.height;
            img.height=f.height;
        }
        f(ctx);
    }catch (e) {
        console.error(e);
    }
}

window.addEventListener('load', () => {
    const body=document.body;

    const select=document.createElement('select');
    select.value='circle';
    select.append(new Option('Circle', 'circle'));
    select.append(new Option('Android', 'android'));
    body.append(select);

    const view=document.createElement('div');
    view.style.display='flex';
    view.style.maxWidth='100vw';
    body.append(view);

    const canvas=document.createElement('canvas');
    view.append(canvas);
    view.style.maxWidth='50vw';

    // canvas.style.flex='0 0 50%';

    const img=document.createElement('img')
    // img.src='./android.svg';
    // img.style.flex='0 0 50%';
    img.style.maxWidth='50vw';
    img.style.height='auto';
    view.append(img);

    select.onchange=(e) => {
        const v=e.target.value;
        console.log("Change to:" , v);
        if(v==='circle') {
            draw(canvas, img, circle);
            img.src='./circle.svg';
        }else if(v==='android') {
            draw(canvas, img, android);
            img.src='./android.svg';
        }
    }



})