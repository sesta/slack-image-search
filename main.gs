function doPost(e) {
  var query = e.parameter.text
  var type = e.parameter.type
  var response = getResponse(query, type)

  var out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  out.setContent(JSON.stringify(response));

  return out
}

function getResponse(query, type) {
  if (query === '') {
    return {
      text: "検索したい言葉を指定してください。 `/image 検索したい言葉`",
    };
  }

  try {
    return {
      text: searchImage(query, type),
      response_type: 'in_channel',
    }
  } catch(error) {
    Logger.log('エラーが発生しました')
    Logger.log(error)
  }

  return {
    text: 'たぶん上限に達しました。1日100回までしか検索できないんです。',
  }
}

function searchImage(query, type) {
  var url = buildApiUrl(query, type)
  var response = UrlFetchApp.fetch(url);

  var content = response.getContentText();
  var json = JSON.parse(content);
  var imageIndex = Math.floor(Math.random() * Math.max(5, json.items.length))
  return json.items[imageIndex].link;
}

function buildApiUrl(query, type) {
  var params = {
    key: PropertiesService.getScriptProperties().getProperty('API_KEY'),
    cx: PropertiesService.getScriptProperties().getProperty('SEARCH_ENGINE_ID'),
    q: query,
    num: 5,
    searchType: 'image',
  };

  if (type === 'anime') {
    params.imgType = 'animated';
    params.imgSize = 'medium';
  }

  var paramStrings = []
  Object.keys(params).forEach(function (key) {
    return paramStrings.push(key + '=' + encodeURIComponent(params[key]));
  });
  return 'https://www.googleapis.com/customsearch/v1?' + paramStrings.join('&')
}

