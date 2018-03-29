const icon = require('./icon.png');

var torrentTitleGroup = [
  'title1', 
  'title2',
  'title3',
  'title4',
  'title5',
  'title6'
];

function displayMsg(scope, value){
  scope.display(
    {
      title: value
    }
  );
}


function generateDisplayObject(copyToClipboard, algoName, hashedValue) {
  return {
    icon,
    title: algoName,
    subtitle: hashedValue,
    clipboard: hashedValue,
    onSelect: (event) => copyToClipboard(hashedValue),
    // onKeyDown: (event) => console.log(event),
    getPreview: () => (
      <div style={{
        maxWidth: '100%',
        wordWrap: 'break-word',
        textAlign: 'center',
        padding: '15px',
        boxSizing: 'border-box'
      }}>
        {hashedValue}
      </div>
    )
  };
}

function btyunsouCrawler(kw, num, sortby) {
  /*
     kw : 关键词
     num: 搜索数量
     num: 排序方式 0：按磁力时间排序，1：按磁力大小排序 2：按磁力热度排序
  */
  if (num < 0 || num > 200){
    num = 10;
  }
  console.log('crawling ' + kw + ' num= ' + num + ' sortby=' + sortby);
  const domain = "http://www.btyunsou.co";



}

const plugin = ({term, display, actions}) => {
  
  // 对输入指令解析
  const match = term.split(' ');
  console.log('你输入的是：' + match);

  const cmdName = match[0];
  const searchName = match[1]; 
  const searchNum = -1;
  const searchSortby = 0;

  console.log(searchName.length);
  if (cmdName === 'magnet' && searchName.length != 0) {
    // 启动爬虫进行搜索
    btyunsouCrawler(searchName, searchNum, searchSortby);

    // 搜索结果进行展示
    display(
      generateDisplayObject(actions.copyToClipboard, searchName, '12345678')
    );
  }
  else {
    console.log('magnet not match');
  }
};



module.exports = {
  fn: plugin,
  name: 'Res name input...',
  keyword: 'magnet'
}