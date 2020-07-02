

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

function createModel(lowGroup) {
    const redGroup = {};
    for (let i=0;i<lowGroup.length;i++) {
        redGroup[lowGroup[i]] = 4;
    }
    for (let i=1;i<=33;i++) {
        if (redGroup[i]) {

        } else {
            redGroup[i] = 5;
        }
    }
    
    const oooo = [];

    for (let i=0; i<156; i++) {
        const currentGroup = [];
        for (let k=0;k<6;k++) {
            let num;
            while(1){
                num = getRandom();
                if (redGroup[num]) {
                    let repeat = false;
                    for (let j=0;j<currentGroup.length;j++) {
                        if (currentGroup[j]==num) {
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat) {
                        currentGroup.push(num);
                        redGroup[num] = redGroup[num]-1;
                        break;
                    }
                }
            }
        }
        currentGroup.sort((a,b)=>{return a-b;});
        // console.log(currentGroup);
        oooo.push(currentGroup);
    }

    console.log(oooo.length);
}

function getRandom() {
    return parseInt(Math.random()*33+1);
}

// readCommand('请输入任意字符：').then((res) => {
//     console.log(res);
// });

// fileRead();

const argv = process.argv.slice(2);

if (argv[0] == '-create') {
    readCommand('请输入9个不重复数字作为低频率球，用空格隔开：').then((res)=>{
        const result = res.split(' ');
        const xx = [];
        for(let i=0;i<9;i++) {
            const num = parseInt(result[i]);
            if (num <= 0 || num > 33 || isNaN(num)) {
                console.log('输入第'+i+'个数字错误');
                return;
            }
            xx.push(num);
        }
        if (xx.length != 9) {
            console.log('输入数量错误');
        }
        createModel(xx);
    });
} else if (argv[0] == '-buy') {
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
                const ccc = check(ggg, xx);
                reward[ccc] = (reward[ccc])?(reward[ccc]+1):1;
            }
            console.log(reward);
        });
    });
} else if ('-test') {
    const xx = [1,2,3,4,5,6,7];
    console.log('输入结果为: '+JSON.stringify(xx));
    fileRead((obj)=>{
        const reward = {};
        for (let i=0; i<obj.length; i++) {
            const ggg = obj[i];
            const ccc = check(ggg, xx);
            reward[ccc] = (reward[ccc])?(reward[ccc]+1):1;
        }
        console.log(reward);
    });
} else {
    console.log('命令参数：');
    console.log('-create 创建自己的模型库');
    console.log('-buy 验证本次结果');
    console.log('示例 node compress_time.js -create');
    console.log('...');
}