const canvas =document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7 

c.fillRect(0,0,canvas.width,canvas.height );

const background = new Sprite({
    position:{
        x: 0,
        y: 0,
    },
    imageSrc: './images/background.png',
});
const shop = new Sprite({
    position:{
        x: 600,
        y: 128,
    },
    imageSrc: './images/shop_anim.png',
    scale: 2.75,
    framesMax: 6,
});
const player = new fighter({
position:{
    x: 0,
    y: 0
},
velocity: {
     x: 0,
     y: 0
},
offset: {
    x: 0,
    y: 0,
},
imageSrc: './images/idle.png',
framesMax: 8,
scale: 2.5,
offset:{
    x: 215,
    y: 157,
},
sprites:{
    idle:{
        imageSrc: './images/idle.png',
        framesMax: 8,
    },
    run:{
        imageSrc: './images/run.png',
        framesMax: 8,
    },
    jump:{
        imageSrc: './images/jump.png',
        framesMax: 2,
    },
    fall:{
        imageSrc: './images/fall.png',
        framesMax: 2,
    },
    attack1:{
        imageSrc: './images/attack1.png',
        framesMax: 6,
    },
    takeHit:{
        imageSrc: './images/TakeHitWhite.png',
        framesMax: 4,
    },
    death:{
        imageSrc: './images/Death.png',
        framesMax: 6,
    },
},
attackBox:{
    offset:{
        x: 100,
        y: 50
    },
    width: 160,
    height: 50
}, 

});
const enemy = new fighter({
    position:{
        x: 400,
        y: 100
    },
    velocity: {
            x: 0,
            y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: './images/enemyidle.png',
    framesMax: 4,
    scale: 2.5,
    offset:{
        x: 215,
        y: 167
    },
    sprites:{
        idle:{
            imageSrc: './images/enemyidle.png',
            framesMax: 4,
        },
        run:{
            imageSrc: './images/enemyrun.png',
            framesMax: 8,
        },
        jump:{
            imageSrc: './images/enemyjump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc: './images/enemyfall.png',
            framesMax: 2,
        },
        attack1:{
            imageSrc: './images/enemyattack1.png',
            framesMax: 4,
        }, 
        takeHit:{
            imageSrc: './images/enemyTakehit.png',
            framesMax: 3,
        },
        death:{
            imageSrc: './images/enemyDeath.png',
            framesMax: 7,
        },
        },
        attackBox:{
            offset:{
              x: -170,
              y: 50
            },
            width: 170,
            height: 50
    },
    });
player.draw(); 
enemy.draw();

const keys = {
    a:{
        pressed: false,
    },
    d:{
        pressed: false,
    },
    w:{
        pressed: false,
    },
    ArrowRight:{
        pressed: false,
    },
    ArrowLeft:{
        pressed: false,
    }
};



decreaseTimer();


function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle ='black';
    c.fillRect(0,0,canvas.width,canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255,255,255,0.15)';
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    enemy.update(); 
    
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    //player movement
    
    if(keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -5;
        player.switchSprites('run');
    }else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5;
        player.switchSprites('run');
    }else{
        player.switchSprites('idle');
    };
    //jump fall player
    if(player.velocity.y < 0){
        player.switchSprites('jump');
    }else if(player.velocity.y > 0){
        player.switchSprites('fall');
    }

    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprites('run');
    }else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprites('run');
    }else{
        enemy.switchSprites('idle')
    }; 
    //enemy jumping falling
    if(enemy.velocity.y < 0){
        enemy.switchSprites('jump');
    }else if(enemy.velocity.y > 0){
        enemy.switchSprites('fall');
    }
    // detect touch
    if(
        rectangularColusion({
        rectangle1: player,
        rectangle2: enemy
     }) && player.isAttacking && player.framesCurrent === 4 ){
        enemy.takeHit(); 
        player.isAttacking = false;
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        });
    };
    // if hit missed player
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false;
    };
    if(
        rectangularColusion({
        rectangle1: enemy,
        rectangle2: player
     }) && enemy.isAttacking && enemy.framesCurrent === 2){
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#playerHealth', {
            width: player.health + '%'
        });
    };
    // if hit missed 
    if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false;
    };
    // eng game no lifes left
    if(enemy.health <= 0 || player.health <=0){
        determineWinner({player,enemy,timerId});
    }

}
animate(); 

window.addEventListener('keydown', (event) => { 
    if(!player.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed = true;
                player.lastkey = 'd';
                break
            case 'a':
                keys.a.pressed = true; 
                player.lastkey = 'a';  
                break 
            case 'w':
                player.velocity.y = -20;  
                break
            case ' ':  
                player.atack();
                break 
    };
   };
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
              keys.ArrowRight.pressed = true;
              enemy.lastkey = 'ArrowRight';
              break
            case 'ArrowLeft':
              keys.ArrowLeft.pressed = true; 
              enemy.lastkey = 'ArrowLeft';  
              break 
            case 'ArrowUp':
              enemy .velocity.y = -20;  
              break 
            case 'ArrowDown':
              enemy.atack();
              break  
          }
    }
});
window.addEventListener('keyup', (event) => { 
    switch(event.key){
      case 'd':
        keys.d.pressed = false;  
        break 
      case 'a':
        keys.a.pressed = false;   
         break   
      case 'ArrowRight':
        keys.ArrowRight.pressed = false;  
        break 
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;   
         break    
    }  
})
