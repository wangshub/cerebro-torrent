const async = require('async');
const fs = require('fs');
const format = require('string-format');
const icon = require('./icon.png');
const request = require('request');
// const axios = require('axios');
const cheerio = require('cheerio');
format.extend(String.prototype, {});


var jsonMagnets = [];

function displayMsg(scope, value) {
  scope.display({title: value});
}

// UI 显示函数
function generateDisplayObject(copyToClipboard, algoName) {
  subtileStr = 'size: ' + algoName.size + ' heat:' + algoName.heat;
  textStr = algoName.title + '\nfileSize: ' + algoName.size + '\nfileHeat: ' + algoName.heat + '\ndate: ' + algoName.time + '\nmagnet: ' + algoName.link + '\n';

  return {
    icon,
    title: algoName.title,
    subtitle: subtileStr,
    clipboard: algoName.link,
    onSelect: (event) => copyToClipboard(algoName.link),
    getPreview: () => (
      <div
        style={{
        maxWidth: '100%',
        wordWrap: 'break-word',
        textAlign: 'center',
        padding: '15px',
        boxSizing: 'border-box'
      }}>
        {algoName.title}
        <p></p>
        {'size: '}{algoName.size} {'heat: '}{algoName.heat}
        <p></p>
        {algoName.link}
      </div>
    )
  };
}

// 爬取某一个网页
var fetchUrl = function (url, callback) {
  // 注意延时
  var delay = parseInt((Math.random() * 30000000) % 500, 10);

  // URL 编码
  url = encodeURI(url)
  console.log('正在爬取：' + url);

  request(url, function (error, response, body) {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the
    // response status code if a response was received console.log('body:', body);
    // // Print the HTML.
    try {
      const $ = cheerio.load(body);
      $('div.media-body').each(function (i, elem) {
        title = $(this)
          .find('a.title')
          .text()
          .replace(/\s+/g, '');
        // console.log(title);
        time = $(this)
          .find('span.label.label-success')
          .text();
        // console.log(time);
        size = $(this)
          .find('span.label.label-warning')
          .text();
        // console.log(size);
        heat = $(this)
          .find('span.label.label-primary')
          .text();
        // console.log(heat);
        link = ($(this).html()).match('<!--<span class="media-down"><a href="(.*?)"><i class="icon-download"><\/i> 磁力下载' +
            '<\/a>')[1];
        // console.log(link);
        jsonMagnets.push({'title': title, 'time': time, 'size': size, 'heat': heat, 'link': link})
      });

    } catch (error) {
      console.log(error);
    }

  });

  setTimeout(function () {
    callback();
  }, delay);
};

function btyunsouCrawler(kw, num, sortby) {
  /*
     kw : 关键词
     num: 搜索数量
     num: 排序方式 0：按磁力时间排序，1：按磁力大小排序 2：按磁力热度排序
  */
  if (num < 0 || num > 200) {
    num = 10;
  }
  console.log('crawling ' + kw + ' num= ' + num + ' sortby=' + sortby);
  const domain = "http://www.btyunsou.co";
  // 网站限制，最多 100 页
  const MaxPageNum = 100;
  // 网站限制，一页最多 10 个资源
  const pageNum = num / 10;
  var torrentUrls = [];
  for (let page = 0; page < pageNum; page++) {
    url = domain + '/search/{0}_ctime_{1}.html'.format(kw, page);
    url = url.replace(' ', '');
    torrentUrls.push(url);
  }
  // console.log(torrentUrls); 并发
  async
    .mapLimit(torrentUrls, 4, function (url, callback) {
      fetchUrl(url, callback);
    }, function (err, result) {
      // console.log('final:'); console.log(result);
      console.log('最后爬取到数据是：');
      console.log(jsonMagnets);

    });

}

const plugin = ({term, display, actions}) => {

  jsonMagnets = []

  // 输入检测
  if (!term.match(/^magnet /)) {
    return;
  }
  const match = term.replace('magnet ', '');

  // 以空格作为确认搜索
  if (match.charAt(match.length - 1) != ' ') {
    return;
  }

  console.log('搜索的资源名称是：' + match);

  try {
    const searchName = match;
    const searchNum = 100;
    const searchSortby = 0;
    btyunsouCrawler(searchName, searchNum, searchSortby);
  } catch (error) {
    console.log(error)
  }

  // 延时，不够优雅
  setTimeout(function () {
    console.log(jsonMagnets);
    jsonMagnets.forEach(function (magnet) {
      display(generateDisplayObject(actions.copyToClipboard, magnet));
    });
  }, 1500);
};

module.exports = {
  fn: plugin,
  name: 'Res name input...',
  keyword: 'magnet'
}