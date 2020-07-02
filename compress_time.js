

//156
//156/33=4.72
//33/6=5.5=6
//即6注能完成全覆盖

// 4*33 = 132
// 156-132=24
// 即有24个号出现5次，33-24=9个号出现4次

// step1. 输入9个低频率数字
// step2. 自动建库、输入文件

const fs = require('fs');
const readline = require('readline');
const { group } = require('console');

function fileWrite(dataString) {
    fs.writeFile(__dirname+'/CTModel',dataString,'utf8',(err)=>{
        if (err) console.log('创建模型失败（写入失败）');
        else console.log('创建模型成功');
    });
}

function fileRead(callback) {
    fs.readFile(__dirname+'/CTModel', (err, data) => {
        if (err) {
            console.log('读取模型失败');
            console.log(err);
            return;
        }
        // console.log(data.toString('utf8'));
        callback(JSON.parse(data.toString('utf8')));
    });
}

function readCommand(tips) {
    tips = tips || '> ';

    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(tips, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function check(group1, group2) {
    let redHint = 0;
    for(let i=0;i<6;i++) {
        const ball1 = group1[i];
        for(j=0;j<6;j++) {
            const ball2 = group2[j];
            if (ball1 == ball2) {
                redHint++;
                break;
            }
        }
    }
    const blueHint = group1[6]==group2[6];
    if (blueHint) {
        if (redHint == 6) {
            return 1;
        } else if (redHint == 5) {
            return 3;
        } else if (redHint == 4) {
            return 4;
        } else if (redHint == 3) {
            return 5;
        } else {
            return 6;
        }
    } else {
        if (redHint == 6) {
            return 2;
        } else if (redHint == 5) {
            return 4;
        } else if (redHint == 4) {
            return 5;
        }
    }
    return 0;
}

function checkNoBlue(group1, group2) {
    let redHint = 0;
    for(let i=0;i<6;i++) {
        const ball1 = group1[i];
        for(j=0;j<6;j++) {
            const ball2 = group2[j];
            if (ball1 == ball2) {
                redHint++;
                break;
            }
        }
    }
    if (redHint == 6) {
        return '一等奖';
    } else if (redHint == 5) {
        return '三等奖';
    } else if (redHint == 4) {
        return '四等奖';
    } else if (redHint == 3) {
        return '五等奖';
    } else {
        return '六等奖';
    }
    return '没中奖';
}

// 计 11*14 = 154
function createModel() {
    
    const oooo = [];

    let k=0;
    while(k<14) {
        const elm = newSixGroup();//len = 11
        if (!isContainArray(oooo, elm)) {
            for (let i=0; i<elm.length; i++) {
                oooo.push(elm[i]);
            }
            k++;
        }
    }
    console.log('完成  共'+oooo.length+'*16条  计 '+oooo.length*16*2+' 元');
    // console.log(oooo);

    fileWrite(JSON.stringify(oooo));
}

function getRandom() {
    return parseInt(Math.random()*33+1);
}

// 1次11条结果
// 加上蓝码共 11*16=176 计 352元
// 5000/352 = 14 次 (4928)

function newSixGroup() {
    const result = [];

    let root = newRedGroup();

    let group = [];
    for (let i=0;i<5;i++) {
        do {
            let xx;
            while(1) {
                xx = parseInt(Math.random()*root.length)
                if (xx >= root.length) continue;
                if (!isContain(group, root[xx])) {
                    break;
                }
            }
            group.push(root[xx]);
            root.splice(xx, 1);
        } while (group.length < 6)
        group.sort((a,b)=>{return a-b});
        result.push(group);
        group = [];
    }
    if (root.length != 3) console.log('算法发生错误');
    group = [];
    for (let i=0;i<root.length;i++) {
        group.push(root[i]);
    }
    root = newRedGroup();
    for (let i=0;root.length>0;i++) {
        do {
            let xx;
            while(1) {
                xx = parseInt(Math.random()*root.length)
                if (xx >= root.length) continue;
                if (!isContain(group, root[xx])) {
                    break;
                }
            }
            group.push(root[xx]);
            root.splice(xx, 1);
        } while (group.length < 6)
        group.sort((a,b)=>{return a-b});
        result.push(group);
        group = [];
    }
    // console.log('处理完成');
    // console.log(result);
    return result;
}

function newRedGroup() {
    const redG = [];
    for (let i=1;i<=33;i++) {
        redG.push(i);
    }
    return redG;
}

function isContain(arr, num) {
    for (let i=0; i<arr.length; i++) {
        if (arr[i]==num) return true;
    }
    return false;
}

function isContainArray(arr1, arr2) {
    for (let i=0; i<arr1.length; i++) {
        for (let j=0; j<arr2.length; j++) {
            if(isSame(arr1[i], arr2[j])) {
                return true;
            }
        }
    }
    return false;
}

function isSame(group1, group2) {
    let sameCount = 0;
    for (let i=0; i<group1.length; i++) {
        if (group1[i] == group2[i]) {
            sameCount++;
        }
    }
    if (sameCount==group1.length) return true;
    else return false;
}

function buyCommand() {
    readCommand('请输入本期结果，用空格隔开：').then((res)=>{
        const result = res.split(' ');
        const xx = [];
        for(let i=0;i<7;i++) {
            xx.push(parseInt(result[i]));
        }
        console.log('输入结果为: '+JSON.stringify(xx));
        fileRead((obj)=>{
            const reward = {};
            for (let i=0; i<obj.length; i++) {
                const ggg = obj[i];
                const ccc = checkNoBlue(ggg, xx);
                reward[ccc] = (reward[ccc])?(reward[ccc]+1):1;
            }
            console.log(reward);
            allMoney(reward, obj.length*16*2);
        });
    });
}

function allMoney(reward, rich) {
    let moeny = 0;
    if (reward['一等奖']) {
        console.log('一等奖' + reward['一等奖'] + ' 个');
    }
    if (reward['三等奖']) {
        console.log('三等奖' + reward['三等奖'] + ' 个  计 ' + reward['三等奖']*3000 + ' 元');
        moeny += reward['三等奖']*3000;
    }
    if (reward['四等奖']) {
        console.log('四等奖' + reward['四等奖'] + ' 个  计 ' + reward['四等奖']*200 + ' 元');
        moeny += reward['四等奖']*200
    }
    if (reward['五等奖']) {
        console.log('五等奖' + reward['五等奖'] + ' 个  计 ' + reward['五等奖']*10 + ' 元');
        moeny += reward['五等奖']*10
    }
    if (reward['六等奖']) {
        console.log('六等奖' + reward['六等奖'] + ' 个  计 ' + reward['六等奖']*5 + ' 元');
        moeny += reward['六等奖']*5
    }
    console.log('小奖合计 '+moeny+'元');
    console.log('花了 '+rich+' 元');
    console.log('收益为 '+ (moeny-rich) + ' 元');
}

function test(){
    let test = isSame([1,2,3,4,5,6], [1,2,3,4,5,7]);
    console.log(test);
}

// readCommand('请输入任意字符：').then((res) => {
//     console.log(res);
// });

// fileRead();

const argv = process.argv.slice(2);

if (argv[0] == '-create') {
    createModel();
} else if (argv[0] == '-buy') {
    buyCommand();
} else if (argv[0] == '-test') {
    test();
} else {
    console.log('命令参数：');
    console.log('-create 创建自己的模型库');
    console.log('-buy 验证本次结果');
    console.log('示例 node compress_time.js -create');
    console.log('...');
}