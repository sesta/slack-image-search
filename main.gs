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
  var url = buildApiUrl(query)
  var response = UrlFetchApp.fetch(url);

  var content = response.getContentText();
  var json = JSON.parse(content);
  var imageIndex = Math.floor(Math.random() * Math.max(10, json.items.length))
  return json.items[imageIndex].link;
}

function buildApiUrl(query) {
  var params = {
    key: PropertiesService.getScriptProperties().getProperty('API_KEY'),
    cx: PropertiesService.getScriptProperties().getProperty('SEARCH_ENGINE_ID'),
    q: query,
    num: 10,
    searchType: 'image',
  };

  var paramStrings = []
  Object.keys(params).forEach(function (key) {
    return paramStrings.push(key + '=' + encodeURIComponent(params[key]));
  });
  return 'https://www.googleapis.com/customsearch/v1?' + paramStrings.join('&')
}

