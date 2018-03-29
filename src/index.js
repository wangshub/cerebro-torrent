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


const plugin = ({term, display, actions}) => {
  const cmdName = 'magnet';
  const searchName = '战狼'; 

  if (cmdName === 'magnet') {
    display(
      generateDisplayObject(actions.copyToClipboard, searchName, '12345678')
    );
  }
  else {
    console.log('not match');
  }
};



module.exports = {
  fn: plugin,
  name: 'Res name input...',
  keyword: 'magnet'
}