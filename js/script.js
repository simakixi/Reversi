let board = [];     //boardを管理する二次元配列
const size = 8;     //boardのサイズ(今回は8×8)
const black = "img/black.png";  //黒の画像を変数に代入
const white = "img/white.png";  //白の画像を変数に代入
const table = document.getElementById("board");
var game=true;
var putwait = true;

setup();

function setup(){   //boardを作成
    for( let i = 0 ; i < size ; i++ ){
        var tr = document.createElement("tr");  //tr要素を作成
        board[i] = [];      //i行目に空の配列を作成(新しい行を作成)
        for( let j = 0; j< size ; j++ ){
            var td = document.createElement("td");  //td要素を作成
            board[i][j] = 0;   //i行目のj列に0を代入(新しい列の作成)
            td.id = "cell"+i+j;
            td.addEventListener("click",put);   //cellクリック時にputメソッドを追加する
            tr.appendChild(td);     //tr要素にtd要素を追加する
        }
        table.appendChild(tr);  //table要素にtr要素を追加する
    }
    replaceimg(3,3,1);
    replaceimg(3,4,2);
    replaceimg(4,3,2);
    replaceimg(4,4,1);
}

async function put(){
    if(putwait){
        putwait = false;
        var place = event.target.id;    //クリックされたcellのidを取得する
        //alert(place.charAt(4)+place.charAt(5));
        let i = place.charAt(4);
        let j = place.charAt(5);
        if(checkgame()){    //盤面が埋まってるかチェック
            setgame();
        }
        if(board[i][j]==0){
            if(check(i,j,1)){
                replace(i,j,1);
                await sleep(500);
                AI();
                if(checkgame()){    //盤面が埋まってるかチェック
                    setgame();
                }
            }else{
                if(checkput(i,j,1)){
                    if(checkgame()){    //盤面が埋まってるかチェック
                        setgame();
                    }
                    AI();
                }
            }
        }else{
            return;
        }
        putwait = true
    }
}

function replaceimg(i,j,c){    //駒を置くメソッド
    var cell = document.getElementById("cell"+i+j);
    if (cell.firstChild) {
        cell.removeChild(cell.firstChild);
    }
    var img = document.createElement("img");
    if(c==1){
        img.src = black;
    }else{
        img.src = white;
    }
    document.getElementById("cell"+i+j).appendChild(img);
    board[i][j] = c;
}

function check(i,j,c){   //クリックした場所におけるかチェック！(上から時計回りに探索)
    if(c==1){
        ec = 2;
    }else{
        ec = 1;
    }
    if(checkcell(i,j,"0<=n","n--","m=m",c,ec)){ return true };
    if(checkcell(i,j,"0<=n&&m<size","n--","m++",c,ec)){ return true };
    if(checkcell(i,j,"m<size","n=n","m++",c,ec)){ return true };
    if(checkcell(i,j,"n<size&&m<size","n++","m++",c,ec)){ return true };
    if(checkcell(i,j,"n<size","n++","m=m",c,ec)){ return true };
    if(checkcell(i,j,"n<size&&0<=m","n++","m--",c,ec)){ return true };
    if(checkcell(i,j,"0<=m","n=n","m--",c,ec)){ return true };
    if(checkcell(i,j,"0<=n&&0<=m","n--","m--",c,ec)){ return true };
    return false;
}
    

function checkcell(i,j,cd,v1,v2,c,ec){  //checkの続き
    n = i;
    m = j;
    let wc = 0;
    let Myflag = false;
    let ENflag = false;
    while(eval(cd)){
        if(wc==1&&board[n][m]==c){
            return false;
        }
        //console.log(n+"　"+m);
        if(board[n][m]==0){
            if(n!=i||m!=j){
                return false;
            }
        }
        if(board[n][m]==ec){
            ENflag = true;
        }
        if(ENflag&&board[n][m]==c){
            Myflag = true;
        }
        if(ENflag&&Myflag){
            return true;
        }
        wc++;
        eval(v1);
        eval(v2);
    }
    return false;
}

function replace(i,j,c){
    replaceimg(i,j,c)
    if(c==1){
        ec = 2;
    }else{
        ec = 1;
    }
    if(replacecell(i,j,"0<=n","n--","m=m",c,ec,"n++","m=m")){ return true };
    if(replacecell(i,j,"0<=n&&m<size","n--","m++",c,ec,"n++","m--")){ return true };
    if(replacecell(i,j,"m<size","n=n","m++",c,ec,"n=n","m--")){ return true };
    if(replacecell(i,j,"n<size&&m<size","n++","m++",c,ec,"n--","m--")){ return true };
    if(replacecell(i,j,"n<size","n++","m=m",c,ec,"n--","m=m")){ return true };
    if(replacecell(i,j,"n<size&&0<=m","n++","m--",c,ec,"n--","m++")){ return true };
    if(replacecell(i,j,"0<=m","n=n","m--",c,ec,"n=n","m++")){ return true };
    if(replacecell(i,j,"0<=n&&0<=m","n--","m--",c,ec,"n++","m++")){ return true };
}

function replacecell(i,j,cd,v1,v2,c,ec,r1,r2){
    n = i;
    m = j;
    let Myflag = false;
    let ENflag = false;
    while(eval(cd)){
        //console.log(n+"　"+m);
        if(board[n][m]==0){
            if(n!=i||m!=j){
                return false;
            }
        }
        if(board[n][m]==ec){
            ENflag = true;
        }
        if(ENflag&&board[n][m]==c){
            Myflag = true;
        }
        if(ENflag&&Myflag){
            while(n!=i||m!=j){
                
                replaceimg(n,m,c);
                eval(r1);
                eval(r2);
            }
            break;
        }
        eval(v1);
        eval(v2);
    }
}

var CNT = 0;
var MAXCNT = 0;
var Ai;
var Aj;
function AI(){
    MAXCNT = 0;
    let cntAI=0;
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            if(board[i][j]==0){
                if(check(i,j,2)){
                    count(i,j,2);
                    cntAI++;
                }
            }
        }
    }
    //console.log(Ai+"　",Aj);
    if(0<cntAI){
        replace(Ai,Aj,2);
    }
}

function count(i,j,c){
    CNT = 0;
    if(c==1){
        ec = 2;
    }else{
        ec = 1;
    }
    if(countcell(i,j,"0<=n","n--","m=m",c,ec,"n++","m=m"));
    if(countcell(i,j,"0<=n&&m<size","n--","m++",c,ec,"n++","m--"));
    if(countcell(i,j,"m<size","n=n","m++",c,ec,"n=n","m--"));
    if(countcell(i,j,"n<size&&m<size","n++","m++",c,ec,"n--","m--"));
    if(countcell(i,j,"n<size","n++","m=m",c,ec,"n--","m=m"));
    if(countcell(i,j,"n<size&&0<=m","n++","m--",c,ec,"n--","m++"));
    if(countcell(i,j,"0<=m","n=n","m--",c,ec,"n=n","m++"));
    if(countcell(i,j,"0<=n&&0<=m","n--","m--",c,ec,"n++","m++"));
    if((i==0&&j==0)||(i==0&&j==7)||(i==7&&j==0)||(i==7&&j==7)){
        MAXCNT = 64;
        Ai = i;
        Aj = j;
    }
    if(MAXCNT<CNT){
        MAXCNT = CNT;
        Ai = i;
        Aj = j;
    }
}

function countcell(i,j,cd,v1,v2,c,ec,r1,r2){
    n = i;
    m = j;
    let wc = 0;
    let Myflag = false;
    let ENflag = false;
    while(eval(cd)){
        //console.log(n+"　"+m);
        if(board[n][m]==0){
            if(n!=i||m!=j){
                return false;
            }
        }
        if(board[n][m]==ec){
            ENflag = true;
        }
        if(ENflag&&board[n][m]==c){
            Myflag = true;
        }
        if(ENflag&&Myflag){
            while(n!=i||m!=j){
                eval(r1);
                eval(r2);
                CNT++;
            }
            return;
        }
        wc++;
        if(wc==1&&board[n][m]==c){
            return false;
        }
        eval(v1);
        eval(v2);
    }
}

function sleep(ms){ //動作にラグを入れるためのもの
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkgame(){
    let blackcnt=0;
    let whitecnt=0;
    let flag = false;
    for(let i = 0;i<size;i++){
        for(let j = 0;j<size;j++){
            if(board[i][j]==1){
                blackcnt++;
            }else if(board[i][j]==2){
                whitecnt++;
            }else{
                flag=true;
            }
        }
    }
    if(flag){
        if(blackcnt==0||whitecnt==0){
            return true;
        }
        return false;
    }else{
        return true;
    }
}

function setgame(){
    game = false;
    let blackcnt=0;
    let whitecnt=0;
    for(let i = 0;i<size;i++){
        for(let j = 0;j<size;j++){
            if(board[i][j]==1){
                blackcnt++;
            }else{
                whitecnt++;
            }
        }
    }
    if(whitecnt==blackcnt){
        alert("引き分け！")
    }else{
        if(whitecnt<blackcnt){
            alert("プレイヤーの勝利！");
        }else{
            alert("AIの勝利！");
        }
    }
}

function checkput(n,m,c){
    let cnt=0;
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            if(board[i][j]==0){
                if(check(i,j,c)){
                    cnt++;
                }
            }
        }
    }
    if(cnt==0){
        return true;
    }
    return false;
}