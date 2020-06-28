const request = require('request');
const cheerio = require('cheerio');

const option = {
    url : 'http://www.cwl.gov.cn/cwl_admin/kjxx/findDrawNotice?name=ssq&issueCount=100',
    headers : {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding' : 'gzip, deflate',
        'Accept-Language' : 'zh-CN,zh;q=0.9,ja;q=0.8,zh-TW;q=0.7',
        Cookie: 'UniqueID=awab4JrB7XwkQrhC1593346697979; Sites=_21; _ga=GA1.3.1030347576.1593346692; _gid=GA1.3.1801705540.1593346692; _gat_gtag_UA_113065506_1=1; 21_vq=7',
        Host: 'www.cwl.gov.cn',
        Referer: 'http://www.cwl.gov.cn/kjxx/ssq/kjgg/',
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        'X-Requested-With' : 'XMLHttpRequest'
    }
}

function callback(error, response, body) {
    if (error) console.log(error);
    else {
        console.log(body);
    }
}

request(option, callback);