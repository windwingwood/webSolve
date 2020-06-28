
red = []
blue = []
for(var i=1;i<34;i++)red.push(i);
for(var i=1;i<17;i++)blue.push(i);

result = []
for(var i=0;i<6;i++){
    const xx = parseInt(Math.random()*red.length)
    result.push(red[xx]);
    red.splice(xx, 1);
}

result.sort((a,b)=>{return a-b});

log = '财富密码\n红球：'
for (i=0;i<6;i++) log += (result[i]+', ')
const xx = parseInt(Math.random()*blue.length)
log += '蓝球：'+ blue[xx]

console.log(log)