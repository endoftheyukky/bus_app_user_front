// 青バスクラスの実装
class BlueBus {
    // busInfo = {};

    // 各機能のフラグ変数
    isFull = false;
    isBarrierFree = false;
    isUp = false;

    // reachTime = 0;
    // images = [];

    constructor(busInfo, imgs, crowd, w) {
        const canvas = document.createElement("canvas");
        const s = 2;
        this.w = w*s;
        this.h = w*s;
        canvas.width = w*s*s;
        canvas.height = w*s*s;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.busInfo = busInfo;
        this.images = imgs

        if (this.busInfo.busStopID > 5){
            this.isUp = true;
        }
        if (this.busInfo.busID == 1){
            this.isBarrierFree = true;
        }
        if (crowd == 1){
            this.isFull = true
        }
    }

    draw() {
        const ctx = this.ctx;;
        const img = this.images[this.selectImage()];
        const reachTime = this.busInfo.estTime.split(":")[1] - this.busInfo.lastDepartureTime.split(":")[1];

        ctx.drawImage(img, 0, 0, this.w, this.w);
        ctx.font = 0.4 * this.w + "px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        var nForDirection = this.w / 11;
        if(this.isUp){nForDirection = this.w / 3.5}
        ctx.fillText(reachTime + "分", this.w / 2, this.w / 2 + nForDirection);
    }

    // フラグ変数をもとに表示する画像の選択
    selectImage() {
        if (this.isUp){
            if (this.isFull && this.isBarrierFree) {
                return 4;
            } else if (!this.isFull && this.isBarrierFree) {
                return 5;
            } else if (this.isFull && !this.isBarrierFree) {
                return 6;
            } else {
                return 7;
            }
        }
        else{
            if (this.isFull && this.isBarrierFree) {
                return 0;
            } else if (!this.isFull && this.isBarrierFree) {
                return 1;
            } else if (this.isFull && !this.isBarrierFree) {
                return 2;
            } else {
                return 3;
            }
        }
    }
}

window.addEventListener("load", async function () {
    // キャンバスタグ
    const busMap = document.createElement("canvas");
    // 幅と硬さの標準は、端末の body タグのサイズ
    // 一旦、画面いっぱいに広げてから、body タグの大きさを求めて設定
    busMap.width = 500;
    busMap.height = 500;
    const body = document.body;
    body.append(busMap);
    // 幅と高さの調整
    busMap.width = document.documentElement.clientWidth;
    busMap.height = document.documentElement.clientHeight;
    busMap.width = document.body.clientWidth;
    busMap.height = document.body.clientHeight - 94.5 - 10;

    const busMapCtx = busMap.getContext("2d");
    const busStops = ['体育館', '経済学部', '総合棟', '正門', 'Egg Dome', 'スポーツ健康学部'];

    var basedofIcon = ""
    if (busMap.width >= busMap.height){basedofIcon = "h";}
    else {basedofIcon = "w";}

    // バス停周辺に影の描画
    function drawShadow(ctx) {
        ctx.shadowColor = "#555";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 5;
    }

    // バス停の描画
    function fillRoundRect(ctx, x, y, w, h, r) {
        createRoundRectPath(ctx, x, y, w, h, r);
        ctx.fill();
    }

    function createRoundRectPath(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arc(x + w - r, y + r, r, Math.PI * (3 / 2), 0, false);
        ctx.lineTo(x + w, y + h - r);
        ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * (1 / 2), false);
        ctx.lineTo(x + r, y + h);
        ctx.arc(x + r, y + h - r, r, Math.PI * (1 / 2), Math.PI, false);
        ctx.lineTo(x, y + r);
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * (3 / 2), false);
        ctx.closePath();
    }

    // 時間によるDarkモードの設定
    function checkDark() {
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 16 && hour <= 17) {
            return false;
        } else {
            return true;
        }
    }

    if (checkDark()) {
        busMapCtx.fillStyle = "#region";
    } else {
        console.log("A");
        busMapCtx.fillStyle = "#EEEEEE";
    }

    busMapCtx.fillRect(0, 0, busMap.width, busMap.height);

    const interval = 4.5 * busMap.height / 100;
    const titleWidth = 7.5 * busMap.height / 100;

    busMapCtx.lineWidth = 5 * busMap.height / 100;
    busMapCtx.lineCap = 'round';
    busMapCtx.strokeStyle = '#33bb44';
    busMapCtx.textAlign = "center";
    busMapCtx.font = "20px 'メイリオ', san-serif";
    busMapCtx.textBaseline = "middle";
    busMapCtx.fillStyle = 'white';

    // 縦のラインの描画
    busMapCtx.beginPath();
    busMapCtx.moveTo(32.5 * busMap.width / 100, 12 * busMap.height / 100);
    busMapCtx.lineTo(32.5 * busMap.width / 100, (busStops.length - 1) * (2 * interval + titleWidth) + interval);
    busMapCtx.moveTo(67.5 * busMap.width / 100, 12 * busMap.height / 100);
    busMapCtx.lineTo(67.5 * busMap.width / 100, (busStops.length - 1) * (2 * interval + titleWidth) + interval);
    busMapCtx.strokeStyle = "gray";
    busMapCtx.lineWidth = 3 * busMap.width / 100;
    busMapCtx.stroke();

    // バス停の描画
    for (let i = 0; i < busStops.length; i++) {
        const y = i * (2 * interval + titleWidth) + (interval + titleWidth / 2);
        console.log(busMap.height);
        console.log(y);
        busMapCtx.strokeStyle = 'black';
        busMapCtx.beginPath();
        
        if (i == 0 || i > 2) {
            if (checkDark()) {
                busMapCtx.fillStyle = "#555555";
            } else {
                busMapCtx.fillStyle = 'white';
            }
            busMapCtx.save();
            drawShadow(busMapCtx);
            fillRoundRect(busMapCtx, 20 * busMap.width / 100, y - titleWidth / 2, 60 * busMap.width / 100, titleWidth, 1 * busMap.width / 100)
            busMapCtx.restore();

            if (checkDark()) {
                busMapCtx.fillStyle = 'white';
            } else {
                busMapCtx.fillStyle = 'black';
            }

            busMapCtx.fillText(busStops[i], busMap.width / 2, y);

        } else {
            if (checkDark()) {
                busMapCtx.fillStyle = "#555555";
            } else {
                busMapCtx.fillStyle = 'white';
            }

            busMapCtx.save();
            drawShadow(busMapCtx);
            fillRoundRect(busMapCtx, 40 * busMap.width / 100, y - titleWidth / 2, 40 * busMap.width / 100, titleWidth, 1 * busMap.width / 100);
            busMapCtx.restore();

            if (checkDark()) {
                busMapCtx.fillStyle = 'white';
            } else {
                busMapCtx.fillStyle = 'black';
            }
            
            busMapCtx.fillText(busStops[i], 60 * busMap.width / 100, y);
        }
    }

    // バスアイコン画像をロード
    function load_images(list) {
        async function load(src) {
            const img = new Image()
            img.src = src
            await img.decode()
            return img
        }
        return Promise.all(list.map(src => load(src)))
    }

    const srcList = ["bus_icon_1.png", "bus_icon_2.png", "bus_icon_3.png", "bus_icon_4.png", "bus_icon_5.png", "bus_icon_6.png", "bus_icon_7.png", "bus_icon_8.png"];
    const images = await load_images(srcList);

    const busList = [];

    // ローカル環境で動かすための、ダミーjsonデータ
    const busInfos = {1:{"busID": 1, "busStopID": 3, "estTime": '2022-09-16 01:39:07.903586', "lastDepartureTime": '2022-09-16 01:36:07.903586'}, 2:{"busID": 2, "busStopID": 6, "estTime": '2022-09-16 01:39:07.903586', "lastDepartureTime": '2022-09-16 01:38:07.903586'}, 3:{"busID": 3, "busStopID": 9, "estTime": '2022-09-16 01:39:07.903586', "lastDepartureTime": '2022-09-16 01:34:07.903586'}};
    
    const busCrowd = {1:1, 2:0, 3:1};
    
    var iconLength = 0;
    for (let i = 1; i <= 3; i++) {
        if(basedofIcon == "h"){iconLength = 10 * busMap.height / 100;}
        else if(basedofIcon == "w"){iconLength = 10 * busMap.width / 100;}
        const blueBus = new BlueBus(busInfos[i], images, busCrowd[i], iconLength);
        busList.push(blueBus);
    }

    for (let b of busList) {
        b.draw(iconLength);
    }

    for (let i = 1; i <= 3; i++) {
        const blueBus = new BlueBus(busInfos[i], images, busCrowd[i], 10 * busMap.width / 100);
        busList.push(blueBus);
    }

    for (let b of busList) {
        b.draw(10 * busMap.width / 100);
    }

    for (let i = 0; i < 3; i++) {
        const stop = busInfos[i + 1].busStopID;
        if (stop <= 5) {
            busMapCtx.drawImage(busList[i].canvas, 67.5 * busMap.width / 100 - iconLength / 2, (2 * interval + titleWidth) * (stop - 1) + titleWidth + 2 * interval - iconLength / 2, busList[i].w, busList[i].h);
        } else {
            busMapCtx.drawImage(busList[i].canvas, 32.5 * busMap.width / 100 - iconLength / 2, (2 * interval + titleWidth) * (10 - stop - 1) + titleWidth + 2 * interval - iconLength / 2, busList[i].w, busList[i].h);
        }
    }

    //help function//
    var helpToggle = true;
    var doReload = true;

    function draw(){
        var basedofIcon = ""
        if (busMap.width >= busMap.height){basedofIcon = "h";}
        else {basedofIcon = "w";}

        busMapCtx.fillStyle = "#EEEEEE";
        busMapCtx.fillRect(0, 0, busMap.width, busMap.height);

        const interval = 4.5 * busMap.height / 100;
        const titleWidth = 7.5 * busMap.height / 100;

        busMapCtx.lineWidth = 5 * busMap.height / 100;
        busMapCtx.lineCap = 'round';
        busMapCtx.strokeStyle = '#33bb44';
        busMapCtx.textAlign = "center";
        busMapCtx.font = "20px 'メイリオ', san-serif";
        busMapCtx.textBaseline = "middle";
        busMapCtx.fillStyle = 'white';

        // 縦のラインの描画
        busMapCtx.beginPath();
        busMapCtx.moveTo(32.5 * busMap.width / 100, 12 * busMap.height / 100);
        busMapCtx.lineTo(32.5 * busMap.width / 100, (busStops.length - 1) * (2 * interval + titleWidth) + interval);
        busMapCtx.moveTo(67.5 * busMap.width / 100, 12 * busMap.height / 100);
        busMapCtx.lineTo(67.5 * busMap.width / 100, (busStops.length - 1) * (2 * interval + titleWidth) + interval);
        busMapCtx.strokeStyle = "gray";
        busMapCtx.lineWidth = 3 * busMap.width / 100;
        busMapCtx.stroke();

        // バス停の描画
        for (let i = 0; i < busStops.length; i++) {
            const y = i * (2 * interval + titleWidth) + (interval + titleWidth / 2);
            console.log(busMap.height);
            console.log(y);
            busMapCtx.strokeStyle = 'black';
            busMapCtx.beginPath();
            if (i == 0 || i > 2) {
                busMapCtx.fillStyle = 'white';
                busMapCtx.save();
                drawShadow(busMapCtx);
                fillRoundRect(busMapCtx, 20 * busMap.width / 100, y - titleWidth / 2, 60 * busMap.width / 100, titleWidth, 1 * busMap.width / 100)
                busMapCtx.restore();

                busMapCtx.fillStyle = 'black';
                busMapCtx.fillText(busStops[i], busMap.width / 2, y);

            } else {
                busMapCtx.fillStyle = 'white';
                busMapCtx.save();
                drawShadow(busMapCtx);
                fillRoundRect(busMapCtx, 40 * busMap.width / 100, y - titleWidth / 2, 40 * busMap.width / 100, titleWidth, 1 * busMap.width / 100);
                busMapCtx.restore();

                busMapCtx.fillStyle = 'black';
                busMapCtx.fillText(busStops[i], 60 * busMap.width / 100, y);
            }
        }
        for (let b of busList) {
            b.draw(iconLength);
        }

        for (let i = 0; i < 3; i++) {
            const stop = busInfos[i + 1].busStopID;
            if (stop <= 5) {
                busMapCtx.drawImage(busList[i].canvas, 67.5 * busMap.width / 100 - iconLength / 2, (2 * interval + titleWidth) * (stop - 1) + titleWidth + 2 * interval - iconLength / 2, busList[i].w, busList[i].h);
            } else {
                busMapCtx.drawImage(busList[i].canvas, 32.5 * busMap.width / 100 - iconLength / 2, (2 * interval + titleWidth) * (10 - stop - 1) + titleWidth + 2 * interval - iconLength / 2, busList[i].w, busList[i].h);
            }
        }
    }

    function redraw(){
        if(!helpToggle){
            busMapCtx.fillStyle = "rgb(255,255,255)";
            busMapCtx.fillRect(0,0,busMap.width,busMap.height);
            helpToggle = true;
            draw();
            doReload = true;
        }
    }

    function popUp(){
        if(helpToggle){
            helpToggle = false;
            popWindow(0);
            doReload = false;
        }
        else{
            redraw();
        }
    }

    function drawHelp(){
        busMapCtx.fillStyle = 'rgb(255,255,255)';
        fillRoundRect(busMapCtx,busMap.width/10,busMap.height/5,busMap.width/5*4,busMap.height/5*3,iconLength/10);
        busMapCtx.drawImage(images[7],busMap.width/5,busMap.height/15*5,iconLength/2,iconLength/2);
        busMapCtx.drawImage(images[6],busMap.width/5,busMap.height/15*7,iconLength/2,iconLength/2);
        busMapCtx.drawImage(images[5],busMap.width/5,busMap.height/15*9,iconLength/2,iconLength/2);
        busMapCtx.drawImage(images[4],busMap.width/15*4,busMap.height/15*9,iconLength/2,iconLength/2);

        busMapCtx.font = 0.2 * iconLength + "px sans-serif";
        busMapCtx.textAlign = "center";
        busMapCtx.fillStyle = "rgb(0,0,0)";
        busMapCtx.fillText("空席です",busMap.width/15*8,busMap.height/45*16)
        busMapCtx.fillText("満席です",busMap.width/15*8,busMap.height/45*21)
        busMapCtx.fillText("バリアフリーの車両です",busMap.width/15*8,busMap.height/45*28)
        busMapCtx.fillText("アイコンに表示されている時間が、次のバス停への到着時刻です",busMap.width/2,busMap.height/45*32)
        busMapCtx.font = 0.4 * iconLength + "px sans-serif";
        busMapCtx.textAlign = "center";
        busMapCtx.fillText("アイコンの見方",busMap.width/2,busMap.height/45*11)
    }
 
    function popWindow(n){
        if(!helpToggle){
            if(n<2){
                busMapCtx.fillStyle = 'rgba(0,0,0,0.1)'
                busMapCtx.fillRect(0,0,busMap.width,busMap.height);
                setTimeout(function(){popWindow(n+1)},100);
            }
            else {
                drawHelp();
            }
        }
    }
 
    var help = document.getElementById("help");
    help.addEventListener("click",popUp,false);
    busMap.addEventListener("click",redraw,false);
 
    function reloading(){
        if(doReload){window.location.reload();}
        
    }
    setInterval(reloading,10000)
}, false);
