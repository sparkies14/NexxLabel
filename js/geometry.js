// ══════════════════════════════════════
// NexLabel Sacred Geometry Background
// Gold & Black — shared across all pages
// ══════════════════════════════════════
(function(){
    const canvas = document.getElementById('geo-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;

    function resize(){
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function gold(a){ return `rgba(201,168,76,${a})`; }

    function polygon(cx,cy,r,sides,rot){
        ctx.beginPath();
        for(let i=0;i<sides;i++){
            const a=rot+(i/sides)*Math.PI*2;
            i===0?ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)
                 :ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
        }
        ctx.closePath();
    }

    function starPoly(cx,cy,r,pts,rot){
        ctx.beginPath();
        for(let i=0;i<pts*2;i++){
            const a=rot+(i/(pts*2))*Math.PI*2;
            const rd=i%2===0?r:r*0.4;
            i===0?ctx.moveTo(cx+Math.cos(a)*rd,cy+Math.sin(a)*rd)
                 :ctx.lineTo(cx+Math.cos(a)*rd,cy+Math.sin(a)*rd);
        }
        ctx.closePath();
    }

    function flowerOfLife(cx,cy,r,a){
        [[0,0],[r,0],[-r,0],[r/2,r*.866],[-r/2,r*.866],[r/2,-r*.866],[-r/2,-r*.866]].forEach(p=>{
            ctx.beginPath();ctx.arc(cx+p[0],cy+p[1],r,0,Math.PI*2);
            ctx.strokeStyle=gold(a);ctx.lineWidth=0.5;ctx.stroke();
        });
    }

    function metatron(cx,cy,r,a){
        const pts=[];
        for(let i=0;i<6;i++){
            const ang=(i/6)*Math.PI*2-Math.PI/6;
            pts.push([cx+Math.cos(ang)*r,cy+Math.sin(ang)*r]);
        }
        pts.push([cx,cy]);
        for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
            ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[j][0],pts[j][1]);
            ctx.strokeStyle=gold(a*.5);ctx.lineWidth=0.35;ctx.stroke();
        }
        polygon(cx,cy,r,6,-Math.PI/6);
        ctx.strokeStyle=gold(a);ctx.lineWidth=0.6;ctx.stroke();
        polygon(cx,cy,r*.577,6,Math.PI/6);
        ctx.strokeStyle=gold(a*.7);ctx.lineWidth=0.4;ctx.stroke();
    }

    function buildShapes(){
        return [
            {type:'flower',  x:.5,  y:.5,  r:90,  sp:.00012, rot:0, a:.08,  dx:.015},
            {type:'metatron',x:.15, y:.2,  r:110, sp:.0002,  rot:0, a:.10,  dx:.025},
            {type:'metatron',x:.85, y:.75, r:130, sp:.00015, rot:1, a:.09,  dx:.02},
            {type:'metatron',x:.5,  y:.15, r:80,  sp:.00025, rot:2, a:.07,  dx:.03},
            {type:'hex',     x:.08, y:.6,  r:70,  sp:.0003,  rot:0, a:.09,  dx:.03},
            {type:'hex',     x:.92, y:.3,  r:85,  sp:.00025, rot:1, a:.08,  dx:.025},
            {type:'hex',     x:.3,  y:.88, r:65,  sp:.0004,  rot:2, a:.07,  dx:.03},
            {type:'hex',     x:.75, y:.1,  r:55,  sp:.00035, rot:3, a:.07,  dx:.025},
            {type:'tri',     x:.2,  y:.5,  r:80,  sp:.0002,  rot:0, a:.08,  dx:.025},
            {type:'tri',     x:.8,  y:.5,  r:90,  sp:.00025, rot:Math.PI, a:.07, dx:.02},
            {type:'star6',   x:.35, y:.15, r:50,  sp:.0004,  rot:0, a:.09,  dx:.03},
            {type:'star6',   x:.65, y:.85, r:60,  sp:.0003,  rot:1, a:.08,  dx:.025},
            {type:'star8',   x:.1,  y:.35, r:45,  sp:.0005,  rot:0, a:.07,  dx:.03},
            {type:'star8',   x:.9,  y:.55, r:50,  sp:.0004,  rot:2, a:.07,  dx:.025},
            {type:'rings',   x:.5,  y:.5,  r:200, sp:.00008, rot:0, a:.05,  dx:.008},
            {type:'rings',   x:.2,  y:.8,  r:120, sp:.00015, rot:0, a:.06,  dx:.015},
            {type:'rings',   x:.8,  y:.2,  r:100, sp:.0002,  rot:0, a:.06,  dx:.02},
            {type:'star5',   x:.25, y:.35, r:55,  sp:.0003,  rot:0, a:.07,  dx:.025},
            {type:'star5',   x:.75, y:.65, r:65,  sp:.00025, rot:1, a:.07,  dx:.02},
        ];
    }

    let shapes=[];

    function draw(){
        ctx.clearRect(0,0,W,H);
        t++;
        shapes.forEach((s,idx)=>{
            const rot=s.rot+t*s.sp*1000;
            const cx=(s.x+Math.sin(t*s.sp*800+idx)*s.dx)*W;
            const cy=(s.y+Math.cos(t*s.sp*700+idx)*s.dx)*H;
            ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);
            switch(s.type){
                case'flower': flowerOfLife(0,0,s.r,s.a); break;
                case'metatron': metatron(0,0,s.r,s.a); break;
                case'hex':
                    polygon(0,0,s.r,6,0);ctx.strokeStyle=gold(s.a);ctx.lineWidth=.6;ctx.stroke();
                    polygon(0,0,s.r,6,Math.PI/6);ctx.strokeStyle=gold(s.a*.55);ctx.lineWidth=.4;ctx.stroke();
                    polygon(0,0,s.r*.6,6,0);ctx.strokeStyle=gold(s.a*.45);ctx.lineWidth=.35;ctx.stroke();
                    ctx.beginPath();ctx.arc(0,0,2,0,Math.PI*2);ctx.fillStyle=gold(s.a*.8);ctx.fill();
                    break;
                case'tri':
                    polygon(0,0,s.r,3,0);ctx.strokeStyle=gold(s.a);ctx.lineWidth=.6;ctx.stroke();
                    polygon(0,0,s.r,3,Math.PI);ctx.strokeStyle=gold(s.a*.65);ctx.lineWidth=.5;ctx.stroke();
                    ctx.beginPath();ctx.arc(0,0,s.r*.35,0,Math.PI*2);ctx.strokeStyle=gold(s.a*.45);ctx.lineWidth=.35;ctx.stroke();
                    break;
                case'star5':
                    starPoly(0,0,s.r,5,0);ctx.strokeStyle=gold(s.a);ctx.lineWidth=.5;ctx.stroke();
                    ctx.beginPath();ctx.arc(0,0,s.r,0,Math.PI*2);ctx.strokeStyle=gold(s.a*.3);ctx.lineWidth=.3;ctx.stroke();
                    break;
                case'star6':
                    starPoly(0,0,s.r,6,0);ctx.strokeStyle=gold(s.a);ctx.lineWidth=.5;ctx.stroke();
                    ctx.beginPath();ctx.arc(0,0,s.r,0,Math.PI*2);ctx.strokeStyle=gold(s.a*.3);ctx.lineWidth=.3;ctx.stroke();
                    break;
                case'star8':
                    starPoly(0,0,s.r,8,0);ctx.strokeStyle=gold(s.a);ctx.lineWidth=.5;ctx.stroke();
                    polygon(0,0,s.r*.7,8,Math.PI/8);ctx.strokeStyle=gold(s.a*.4);ctx.lineWidth=.3;ctx.stroke();
                    break;
                case'rings':
                    for(let ri=1;ri<=5;ri++){
                        const pulse=1+Math.sin(t*.02+ri)*.03;
                        ctx.beginPath();ctx.arc(0,0,s.r*(ri/5)*pulse,0,Math.PI*2);
                        ctx.strokeStyle=gold(s.a*(1-ri*.12));ctx.lineWidth=.35;ctx.stroke();
                    }
                    for(let li=0;li<6;li++){
                        const ang=(li/6)*Math.PI*2;
                        ctx.beginPath();
                        ctx.moveTo(Math.cos(ang)*s.r*.2,Math.sin(ang)*s.r*.2);
                        ctx.lineTo(Math.cos(ang)*s.r,Math.sin(ang)*s.r);
                        ctx.strokeStyle=gold(s.a*.35);ctx.lineWidth=.3;ctx.stroke();
                    }
                    break;
            }
            ctx.restore();
        });
        requestAnimationFrame(draw);
    }

    resize();shapes=buildShapes();draw();
    window.addEventListener('resize',()=>{resize();shapes=buildShapes();});
})();
