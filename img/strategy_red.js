'use strict';

 function spellHere(state,xy,dir) { 
   for (let spell of state.spells){
        if(xy.x == spell.xy.x && xy.y == spell.xy.y){
            if (dir.x == spell.dir.x && dir.y == spell.dir.y){
                return true;
            }
        }  
    }
 }

class StrategyRedTeam1 extends MageStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

    init(level, state) {}

    turn(state) {
        let i , j;
        let borderX , borderY , borderH ;
        let didDodged, danger;
        //          horiz  vertic  main-d r-diag
        let key = ['open', 'open', 'open', 'open'];

                                // Вытаскиваем данные //
            let action = {id: this.id};
            let my = new XY();
                for (let mage of state.mages) {
                    if (this.id == mage.id) {
                        my = mage.xy;
                    }
                }

            for(i = 1 ; i >=-1 ; i-=2) {
                    if (i > 0){
                        borderX = 0;
                        borderY = 0; 
                        borderH = level.width ;
                    }else{ 
                        borderX = level.width * (-1);
                        borderY = level.height * (-1);
                        borderH = 0;    
                    }
                for(j = 1; j<=4; j++) {
                    // x , y  
                    if (i*(my.x - j*i) > borderX && key[0] == 'open') {
                        if (spellHere(state, new XY((my.x - j*i),my.y),new Direction(i,0)) == true) {
                             key[0] = 'close';
                        }  
                    } 
                    if (i*(my.y - j*i) > borderY && key[1] == 'open') {
                   //console.log('y =' + (my.y - j*i));   
                        if (spellHere(state, new XY(my.x,(my.y - j*i)),new Direction(0,i)) == true) {
                             key[1] = 'close';
                        } 
                    }    
                    // main diag
                    if (i*(my.y - j*i) > borderY && i*(my.x - j*i) > borderX && key[2] == 'open') {
                        if (spellHere(state, new XY((my.x - j*i),(my.y - j*i)),new Direction(i,i)) == true) {
                             key[2] = 'close';
                        } 
                    }    
                    //  secondary diag
                    if (i*(my.y - j*i) > borderY && i*(my.x + j*i) < borderH && key[3] == 'open') { 
                        if (spellHere(state, new XY((my.x + j*i),(my.y - j*i)),new Direction(-i,i) ) == true) {
                             key[3] = 'close';
                        }
                    }    
                }
            }  

            console.log(key); 
                                // Вытаскиваем данные  //
    // Анализ данных //
    if (key[0] == 'open' && key[1] == 'open' && key[2] == 'open' && key[3] == 'open')
        danger = false;
    else
        danger = true;

    didDodged = false;

    console.log('danger is  ' + danger);

    if (danger == true) {
      if (key[0] == 'close' || key[1] == 'close') {

            if (key[0] == 'open') {

                if (level.plan[my.y][my.x - 1] == Cell.EMPTY ) {
                    console.log('IM HERE : key[0]=' + key[1] + '    x = ' + my.x);
                    my.x -= 1;
                    console.log('x = ' + my.x);
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,0);
                    didDodged = true;
                }else if (level.plan[my.y][my.x + 1] == Cell.EMPTY) {
                    console.log('IM HERE : key[1]=' + key[1] + '    x = ' + my.x);
                    my.x += 1;
                    console.log('x = ' + my.x);
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,0);
                    didDodged = true;
                }

            }else if (key[1] == 'open'){

                    if (level.plan[my.y - 1][my.x] == Cell.EMPTY ) {
                        console.log('IM HERE : key[0]=' + key[0] + '    y = ' + my.y);
                        my.y -= 1;
                        console.log('y = ' + my.y);
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(0,-1);
                        didDodged = true;
                    }else if (level.plan[my.y + 1][my.x] == Cell.EMPTY) {
                        console.log('IM HERE : key[0]=' + key[0] + '    y = ' + my.y);
                        my.y += 1;
                        console.log('y = ' + my.y);
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(0,1);
                        didDodged = true;
                    }
            }else{
                  
                }
            } 
        }


    if (danger == true) {

        if ((key[0] == 'open' || key[1] == 'open') && (key[2] == 'close' || key[3] == 'close')) {

            if (key[0] == 'open') {
                if (level.plan[my.y][my.x - 1] == Cell.EMPTY ) {
                    my.x -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,0);
                    didDodged = true;
                }else if (level.plan[my.y][my.x + 1] == Cell.EMPTY) {
                    my.x += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,0);
                    didDodged = true;
                }

            }else if(key[1] == 'open'){

                if (level.plan[my.y - 1][my.x] == Cell.EMPTY ) {
                    my.y -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(0,-1);
                    didDodged = true;
                }else if (level.plan[my.y + 1][my.x] == Cell.EMPTY) {
                    my.y += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(0,1);
                    didDodged = true;
                }
            }
        }

        let aaa;
        aaa = false;

        if ((key[0] == 'close' && key[1] == 'close') && (key[2] == 'close' || key[3] == 'close')) {
        start: while(aaa == false){
            if (key[2] == 'close' && key[3] == 'close') {
                didDodged = false;
                aaa = true;
            }else if (key[2] == 'close') {

                if (level.plan[my.y + 1][my.x - 1] == Cell.EMPTY) {
                    my.x -= 1;
                    my.y += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,1);
                    didDodged = true;
                    aaa = true;
                }else if(level.plan[my.y - 1][my.x + 1] == Cell.EMPTY){
                    my.x += 1;
                    my.y -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,-1);
                    didDodged = true;
                    aaa = true;
                }else{
                    key[3] = 'close';
                    continue start;
                }

            }else{

                if (level.plan[my.y - 1][my.x - 1] == Cell.EMPTY) {
                    my.x -= 1;
                    my.y -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,-1);
                    didDodged = true;
                    aaa = true;
                }else if(level.plan[my.y + 1][my.x + 1] == Cell.EMPTY){
                    my.x += 1;
                    my.y += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,1);
                    didDodged = true;
                    aaa = true;
                }else{
                    key[2] = 'close';
                    continue start;
                }
               
            }
        }
        }
    }           
    //////////////////////////////  УКЛОНЕНИЕ ///////////////////////////////////////////

                                //   Атака    //

    if (didDodged = false) {  /* Атака   */ }
        return action;
    }
}


class StrategyRedTeam2 extends MageStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }
    init(level, state) {}

        turn(state) {
            let didDodged = false;
            let readyToFire = false;

                let action = {id: this.id};
                let opponent = new XY();
                let my = new XY();

            for (let mage of state.mages){
                if (this.id == mage.id){
                    my = mage.xy;

                }
            }
            for (let mage of state.mages){
                    if (this.id !== mage.id){
                         opponent = mage.xy;
                    }     
            }
         
        let deltaX = Math.abs(opponent.x - my.x);                // íàäî âûòàùèòü äàííûå è çàïèñàòü èõ â êîîðäèíàòû 
        let deltaY = Math.abs(opponent.y - my.y);
            let vectorX ;
            let vectorY ;

                    if (deltaX != 0) 
                        vectorX = ( opponent.x - my.x ) / Math.abs(opponent.x - my.x); 
                    else 
                        vectorX = 0;

                    if (deltaY != 0)
                        vectorY = ( opponent.y - my.y ) / Math.abs(opponent.y - my.y);
                    else
                        vectorY = 0;


    


/*for (let x = my.x-8; x <= my.x+8; x++){
    for (let spell of state.spells){
        if (x == spell.xy.x){
                if (x < my.x){
                    if (spell.dir.x > 0){
                        if (my.y-1 == Cell.EMPTY){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,-1);
                            didDodged = true;
                        }else{
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,1);
                            didDodged = true;
                        }
                    }
                }
        }
    }
}

if (!didDodged){
    for (let y = my.y-8; y <= my.y+8; y++){
         for (let spell of state.spells){
        if (y == spell.xy.y){
                if (y < my.y){
                    if (spell.dir.y > 0){
                        if (my.x-1 == Cell.EMPTY){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(-1,0);
                            didDodged = true;

                        }else{
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(1,0);
                            didDodged = true;

                        }
                    }
                }
        }
    }
}
}

*/


if (!didDodged){

if ( ((Math.abs(deltaX - deltaY) <= deltaX ) || (Math.abs(deltaX - deltaY) <= deltaY ) )&& deltaX > 1 && deltaY >1) {
    
    if (((deltaX - deltaY) == 0) && (deltaX > 1)){
        readyToFire = true ;
    }else if (deltaX < deltaY) {
        action.type = ActionType.MOVE; 
        if (deltaX < 5) 
            action.dir = new Direction(0,vectorY); 
        else
            action.dir = new Direction(vectorX,vectorY); 
        
    }else if (deltaX > deltaY) {
        action.type = ActionType.MOVE;
        if (deltaY < 5)
            action.dir = new Direction(vectorX,0);
        else
            action.dir = new Direction(vectorX,vectorY); 
    }

} else if( (deltaX == 0 && deltaY > 1 ) || (deltaY == 0 && deltaX > 1 ) ) 
    {    
        action.type = ActionType.CAST;
        action.spell = new FireballSpell();            
        action.spell.dir = new Direction(vectorX,vectorY); 
    }
    else
    {
                if (deltaX > 1 && deltaY > 1) { //main if
                    if (deltaX < deltaY){
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(vectorX,0); 
                    }else if(deltaX > deltaY){
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(0,vectorY); 
                    } else {
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(vectorX,vectorY); 
                    }
                }else{
                    if (deltaX == 1){  
                        if (deltaY > 5){                         // or 3 - better
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,vectorY); 
                        }else{
                            readyToFire = true;
                        }

                    }else if (deltaY == 1) {
                        if (deltaX > 5) {
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(vectorX,0); 
                        }else{
                            readyToFire = true;
                        }
                    } 
                }   // main
            }
        }
// function
                if (readyToFire == true) {                  // start if
                    if (deltaX - deltaY == 0) 
                    {
                        action.type = ActionType.CAST;
                        action.spell = new FireballSpell();            
                        action.spell.dir = new Direction(vectorX,vectorY);        
                    }
                    else if (deltaX + deltaY < 2) {
                        if ( level.plan[my.y][my.x - vectorX] == Cell.EMPTY){ // åñëè ñêëÿíêà èëè äðóãîé ìàã - Error
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction((-1)*vectorX,0); 
                        }else if( level.plan[my.y - vectorY][my.x] == Cell.EMPTY){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,(-1)*vectorY); 
                        }   
                        else {                          // êàæåòñÿ òóò íàäî äîïèëèòü
                            // fireball - attack 
                        }
                    }else{
                        if (deltaX < deltaY){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(vectorX,0); 
                        }else{
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,vectorY); 
                        }
                    }  
                }                                           // end if   
        
        return action;
        }    

    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class StrategyRedTeam3 extends MageStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

    init(level, state) {}

    turn(state) {
        let i , j;
        let borderX , borderY , borderH ;
        let didDodged, moveDone , danger;
        //          horiz  vertic  main-d r-diag
        let key = ['open', 'open', 'open', 'open'];
        moveDone = false;
                                // Вытаскиваем данные //
            let action = {id: this.id};
            let opponent = new XY();
            let my = new XY();

                for (let mage of state.mages) {
                    if (this.id == mage.id) {
                        my = mage.xy;
                    }
                }
                            // Вытаскиваем данные  //

            for(i = 1 ; i >=-1 ; i-=2) {
                    if (i > 0){
                        borderX = 0;
                        borderY = 0; 
                        borderH = level.width ;
                    }else{ 
                        borderX = level.width * (-1);
                        borderY = level.height * (-1);
                        borderH = 0;    
                    }
                for(j = 1; j<=4; j++) {
                    // x , y  
                    if (i*(my.x - j*i) > borderX && key[0] == 'open') {
                        if (spellHere(state, new XY((my.x - j*i),my.y),new Direction(i,0)) == true) {
                             key[0] = 'close';
                        }  
                    } 
                    if (i*(my.y - j*i) > borderY && key[1] == 'open') {
                   //console.log('y =' + (my.y - j*i));   
                        if (spellHere(state, new XY(my.x,(my.y - j*i)),new Direction(0,i)) == true) {
                             key[1] = 'close';
                        } 
                    }    
                    // main diag
                    if (i*(my.y - j*i) > borderY && i*(my.x - j*i) > borderX && key[2] == 'open') {
                        if (spellHere(state, new XY((my.x - j*i),(my.y - j*i)),new Direction(i,i)) == true) {
                             key[2] = 'close';
                        } 
                    }    
                    //  secondary diag
                    if (i*(my.y - j*i) > borderY && i*(my.x + j*i) < borderH && key[3] == 'open') { 
                        if (spellHere(state, new XY((my.x + j*i),(my.y - j*i)),new Direction(-i,i) ) == true) {
                             key[3] = 'close';
                        }
                    }    
                }
            }  

            console.log(key); 
    // Анализ данных //
    if (key[0] == 'open' && key[1] == 'open' && key[2] == 'open' && key[3] == 'open')
        danger = false;
    else
        danger = true;


    console.log('danger is  ' + danger);

    if (danger == true) {
      if (key[0] == 'close' || key[1] == 'close') {

            if (key[0] == 'open') {

                if (level.plan[my.y][my.x - 1] == Cell.EMPTY ) {
                    my.x -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,0);
                        moveDone = true;
                }else if (level.plan[my.y][my.x + 1] == Cell.EMPTY) {
                    my.x += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,0);
                        moveDone = true;
                }

            }else if (key[1] == 'open'){

                    if (level.plan[my.y - 1][my.x] == Cell.EMPTY ) {
                        my.y -= 1;
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(0,-1);
                            moveDone = true;
                    }else if (level.plan[my.y + 1][my.x] == Cell.EMPTY) {
                        my.y += 1;
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(0,1);
                            moveDone = true;
                    }
            }else{
                  
                }
            } 
        }


    if (danger == true) {

        if ((key[0] == 'open' || key[1] == 'open') && (key[2] == 'close' || key[3] == 'close')) {

            if (key[0] == 'open') {
                if (level.plan[my.y][my.x - 1] == Cell.EMPTY ) {
                    my.x -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,0);
                        moveDone = true;
                }else if (level.plan[my.y][my.x + 1] == Cell.EMPTY) {
                    my.x += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,0);
                        moveDone = true;
                }

            }else if(key[1] == 'open'){

                if (level.plan[my.y - 1][my.x] == Cell.EMPTY ) {
                    my.y -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(0,-1);
                        moveDone = true;
                }else if (level.plan[my.y + 1][my.x] == Cell.EMPTY) {
                    my.y += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(0,1);
                        moveDone = true;
                }
            }
        }

        let checkLoop;
        checkLoop = false;

        if ((key[0] == 'close' && key[1] == 'close') && (key[2] == 'close' || key[3] == 'close')) {
        start: while(checkLoop == false){
            if (key[2] == 'close' && key[3] == 'close') {
                moveDone = false ;
                checkLoop = true;
            }else if (key[2] == 'close') {

                if (level.plan[my.y + 1][my.x - 1] == Cell.EMPTY) {
                    my.x -= 1;
                    my.y += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,1);
                        moveDone = true;
                    checkLoop = true;
                }else if(level.plan[my.y - 1][my.x + 1] == Cell.EMPTY){
                    my.x += 1;
                    my.y -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,-1);
                        moveDone = true;
                    checkLoop = true;
                }else{
                    key[3] = 'close';
                    continue start;
                }

            }else{

                if (level.plan[my.y - 1][my.x - 1] == Cell.EMPTY) {
                    my.x -= 1;
                    my.y -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,-1);
                        moveDone = true;
                    checkLoop = true;
                }else if(level.plan[my.y + 1][my.x + 1] == Cell.EMPTY){
                    my.x += 1;
                    my.y += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,1);
                        moveDone = true;
                    checkLoop = true;
                }else{
                    key[2] = 'close';
                    continue start;
                }
               
            }
        }
        }
    }           
//////////////////////////////////////// УКЛОНЕНИЕ  //////////////////////////////////////////////////////////////////////
    let deltaX;
    let deltaY;
        let vectorX ;
        let vectorY ;
    let New_distance;   
    let targetBottle = new XY(); 
//////////////////////////////////////    Helth    ///////////////////////////////////////////////////////////////////////
 if ( moveDone == false ) {

    let HealBottleDistance = 100;
      let myHealth; 


                for (let mage of state.mages){
                     if (mage.id == this.id){
                         myHealth = mage.health;
                     }
                }
 
                 if ( myHealth < 40 ){
                    for (let bottle of state.bottles){
                        deltaX = Math.abs(bottle.xy.x - my.x);                
                        deltaY = Math.abs(bottle.xy.y - my.y);
                        New_distance = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
                            if (New_distance < HealBottleDistance && bottle.type == 'health'){
                                HealBottleDistance = New_distance;
                                 targetBottle = bottle.xy; 
                            }     
                    }
 
                        if (Math.abs(targetBottle.x - my.x) !== 0) 
                            vectorX = ( targetBottle.x - my.x ) / Math.abs(targetBottle.x - my.x); 
                        else 
                            vectorX = 0;
 
                        if (Math.abs(targetBottle.y - my.y) !== 0)
                            vectorY = ( targetBottle.y - my.y ) / Math.abs(targetBottle.y - my.y);
                        else {
                            vectorY = 0;
                        }
                            action.type = ActionType.MOVE;
                            action.dir = new Direction(vectorX,vectorY);
                            console.log ('DeltaX = ', vectorX, ' so deltaY =', vectorY);
                            moveDone = true;
                }
}
//////////////////////////////////////    Mana     ///////////////////////////////////////////////////////////////////////
    if ( moveDone == false ) {
        let Bottle_distance = 100;       
            let myMana; 

                for (let mage of state.mages){
                    if (mage.id == this.id){
                        myMana = mage.mana;
                    }
                }

                if ( myMana < 10 ){
                    for (let bottle of state.bottles){
                        deltaX = Math.abs(bottle.xy.x - my.x);                
                        deltaY = Math.abs(bottle.xy.y - my.y);
                        New_distance = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
                            if (New_distance < Bottle_distance && bottle.type == 'mana'){
                                Bottle_distance = New_distance;
                                targetBottle = bottle.xy; 
                            }     
                    }

                        if (Math.abs(targetBottle.x - my.x) !== 0) 
                            vectorX = ( targetBottle.x - my.x ) / Math.abs(targetBottle.x - my.x); 
                        else 
                            vectorX = 0;

                        if (Math.abs(targetBottle.y - my.y) !== 0)
                            vectorY = ( targetBottle.y - my.y ) / Math.abs(targetBottle.y - my.y);
                        else {
                            vectorY = 0;
                        }
                            action.type = ActionType.MOVE;
                            action.dir = new Direction(vectorX,vectorY);
                            console.log ('DeltaX = ', vectorX, ' so deltaY =', vectorY);
                            moveDone = true;
                }
        }

///////////////////////////////////////////   Атака    //////////////////////////////////////////////////////////////

    let readyToFire = false;

if ( moveDone == false ){
    let Old_distance = 100;     

        for (let mage of state.mages){
                deltaX = Math.abs(mage.xy.x - my.x);                
                deltaY = Math.abs(mage.xy.y - my.y);
                New_distance = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
                    if (this.id != mage.id && mage.teamId != this.team.id && mage.status != Status.DEAD && New_distance < Old_distance){
                        Old_distance = New_distance;
                        opponent = mage.xy; 
                }     
        }
         
        deltaX = Math.abs(opponent.x - my.x);                // надо вытащить данные и записать их в координаты 
        deltaY = Math.abs(opponent.y - my.y);

                    if (deltaX != 0) 
                        vectorX = ( opponent.x - my.x ) / Math.abs(opponent.x - my.x); 
                    else 
                        vectorX = 0;

                    if (deltaY != 0)
                        vectorY = ( opponent.y - my.y ) / Math.abs(opponent.y - my.y);
                    else
                        vectorY = 0;


if ( ((Math.abs(deltaX - deltaY) <= deltaX ) || (Math.abs(deltaX - deltaY) <= deltaY ) ) && deltaX > 1 && deltaY >1) {
    
    if (((deltaX - deltaY) == 0) && (deltaX > 3)){
        readyToFire = true ;
    }else if (deltaX < deltaY) {
        action.type = ActionType.MOVE; 
        if (deltaX < 5){ 
            action.dir = new Direction(0,vectorY); 
             readyToFire = false;
        }
        else{
            action.dir = new Direction(vectorX,vectorY); 
            readyToFire = false;
        }
        
    }else if (deltaX > deltaY) {
        action.type = ActionType.MOVE;
        if (deltaY < 5){
            action.dir = new Direction(vectorX,0);
            readyToFire = false;
        }
        else{
            action.dir = new Direction(vectorX,vectorY);
            readyToFire = false; 
        }
    }

} else if( (deltaX == 0 && deltaY > 1 ) || (deltaY == 0 && deltaX > 1 ) ) 
    {    
        action.type = ActionType.CAST;
        action.spell = new FireballSpell();            
        action.spell.dir = new Direction(vectorX,vectorY); // вектор атаки
            readyToFire = false;
    }
    else
    {
                if (deltaX > 1 && deltaY > 1) { //main if
                    if (deltaX < deltaY){
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(vectorX,0); 
                           readyToFire = false;
                    }else if(deltaX > deltaY){
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(0,vectorY);
                           readyToFire = false; 
                    } else {
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(vectorX,0); 
                           readyToFire = false;
                    }
                }else if(deltaX == 1 && deltaY == 1){
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(-vectorX,-vectorY);
                        readyToFire = false; 
                }else if (deltaX == 1 || deltaY == 1) {
                    if (deltaX == 1){  
                        if (deltaY > 3){                         // or 3 - better
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,vectorY); 
                               readyToFire = false;
                        }else if(deltaY == 0){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(-vectorX,0); 
                               readyToFire = false;                            
                        }else{
                            readyToFire = true;
                        }

                    }else if (deltaY == 1) {
                        if (deltaX > 3) {
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(vectorX,0); 
                               readyToFire = false;
                        }else if(deltaX == 0){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,-vectorY); 
                               readyToFire = false;  
                        }else{
                            readyToFire = true;
                        }
                    } 
                }   // main
            } 
// function
                if (readyToFire == true) {                  // start if
                    if ((deltaX - deltaY == 0)) 
                    {
                        action.type = ActionType.CAST;
                        action.spell = new FireballSpell();            
                        action.spell.dir = new Direction(vectorX,vectorY);        
                    }
                    else if (deltaX + deltaY < 2) {
                        if ( level.plan[my.y][my.x - vectorX] == Cell.EMPTY){ // åñëè ñêëÿíêà èëè äðóãîé ìàã - Error
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction((-1)*vectorX,0); 
                        }else if( level.plan[my.y - vectorY][my.x] == Cell.EMPTY){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,(-1)*vectorY); 
                        }   
                        else {                          // êàæåòñÿ òóò íàäî äîïèëèòü
                            // fireball - attack 
                        }
                    }else{
                        if (deltaX < deltaY){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(vectorX,0); 
                        }else{
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,vectorY); 
                        }
                    }  
                }                                         // end if
           
        }   

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        return action;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class StrategyRedTeam4 extends MageStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

    init(level, state) {}

    turn(state) {
        let action = { id: this.id };
        let dir = [new Direction(-1, 0), new Direction(1, 0), new Direction(0, -1), new Direction(0, 1)];
        let n = Math.floor(Math.random() * dir.length);
        let chance = Math.floor(Math.random() * 100);
        if (chance < 80) {
            action.type = ActionType.MOVE;
            action.dir = dir[n];
        } else {            
            action.type = ActionType.CAST;
            action.spell = new FireballSpell();            
            action.spell.dir = dir[n];
        }        
        return action;
    }
}

/*  
        let vectorLogicArray = [
            [0, 0,0, 0,0],
            [0, 0,0, 0,0]
        ];

            // DON'T TUCH
                for(j = 1; j<=3; j++) {
                    // x , y
                    if (my.x - j > 0 && key[0] == 'open') {
                        if (pos[my.y][my.x-j] == 'fireball' ) {
                            if ('направление'=='dir') {
                                 key[0] = 'close';
                            }
                        }
                    } 
                    if (my.y - j > 0 && key[1] == 'open') {   
                        if (pos[my.y-j][my.x] == 'fireball' ) {
                            if ('направление'=='dir') {
                                 key[1] = 'close';
                            }
                        }
                    }    
                    // main diag
                    if (my.y - j > 0 && my.x - j > 0 && key[2] == 'open') {
                        if (pos[my.y-j][my.x-j] == 'fireball') {
                            if ('направление'=='dir') {
                                key[2] = 'close';
                            }
                        }
                    }    
                    //  secondary diag
                    if (my.y - j > 0 && my.x + j < GRID_SIZE && key[3] == 'open') {
                        if (pos[my.y-j][my.x+j] == 'fireball') {
                             if ('направление'=='dir') {
                                key[3] = 'close';
                            }
                        }
                    }    
                }
                for(j = 1; j<=3; j++) {
                    // x , y
                    if (my.x + j < GRID_SIZE && key[0] == 'open') {
                        if (pos[my.y][my.x+j] == 'fireball' ) {
                            if ('направление'=='dir') {
                                 key[0] = 'close';
                            }
                        }
                    } 
                    if (my.y + j < GRID_SIZE && key[1] == 'open') {   
                        if (pos[my.y+j][my.x] == 'fireball' ) {
                            if ('направление'=='dir') {
                                 key[1] = 'close';
                            }
                        }
                    }    
                    // main diag
                    if (my.y + j < GRID_SIZE && my.x + j < GRID_SIZE && key[2] == 'open') {
                        if (pos[my.y+j][my.x+j] == 'fireball') {
                            if ('направление'=='dir') {
                                key[2] = 'close';
                            }
                        }
                    }    
                    //  secondary diag
                    if (my.y + j < GRID_SIZE && my.x - j > 0 && key[3] == 'open') {
                        if (pos[my.y+j][my.x+j] == 'fireball') {
                             if ('направление'=='dir') {
                                key[3] = 'close';
                            }
                        }
                    }    
                }
            // DON'T TUCH

                    // LOGIC //
/*
            if (vectorLogicArray[0][0] != 0)   // при условии, что мы записывали в массив только летящие в нас шары
                key[0] = "close";
            
            if (vectorLogicArray[1][0] != 0) 
                key[1] = "close";
    
            if (vectorLogicArray[0][2] + vectorLogicArray[1][2] == 2 || vectorLogicArray[0][3] + vectorLogicArray[1][3] == -2) 
                key[3] = 'close';

            if ((vectorLogicArray[0][4] == 1 && vectorLogicArray[1][4] == -1) || (vectorLogicArray[0][5] == -1 && vectorLogicArray[1][5] == 1))
                key[4] = 'close';

        if ((key[0] == 'open' && key[1] == 'close') && (key[2] == 'open' && key[3] == 'open')) {
                if (my.x - 1 == Cell.EMPTY ) {

                }else if (my.x + 1 == Cell.EMPTY) {

                }else continue GOTO;

        }else if ((key[0] == 'close' && key[1] == 'open') && (key[2] == 'open' && key[3] == 'open')) {
                if (my.y - 1 == Cell.EMPTY ) {

                }else if (my.y + 1 == Cell.EMPTY) {

                }else continue GOTO; 
        }*/