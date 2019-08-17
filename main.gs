function apiTest() {
  Logger.log(getTopImageUrl('test'))
}

function doPost(e) {
  var text = 'たぶん上限に達しました。1日100回までしか検索できないんです。'
  try {
    text = getTopImageUrl(e.parameter.text)
  } catch(error) {
    Logger.log('エラーが発生しました')
    Logger.log(error)
  }

  var out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  out.setContent(JSON.stringify({
    text: text,
    response_type: 'in_channel',
  }));

  return out
}

function getTopImageUrl(query) {
  var API_KEY = PropertiesService.getScriptProperties().getProperty('API_KEY');
  var SEARCH_ENGINE_ID = PropertiesService.getScriptProperties().getProperty('SEARCH_ENGINE_ID');

  var url = 'https://www.googleapis.com/customsearch/v1?key=' + API_KEY + '&cx=' + SEARCH_ENGINE_ID + '&num=10&searchType=image&q=' + encodeURI(query);
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var object = Utilities.jsonParse(json);
  return object.items[Math.floor(Math.random() * Math.max(10, object.items.length))].link;
}


