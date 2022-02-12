javascript: (async () => {

  /* Optional vault name */
  const vault = "";

  /* Optional folder name such as "Clippings/" */
  const folder = "Clippings/";

  /* Optional tags  */
  const tags = "clippings";

  function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
      var sel = window.getSelection();
      if (sel.rangeCount) {
        var container = document.createElement("div");
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
    } else if (typeof document.selection != "undefined") {
      if (document.selection.type == "Text") {
        html = document.selection.createRange().htmlText;
      }
    }
    return html;
  }

  const selection = getSelectionHtml();

  function getFileName(fileName) {
    var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      fileName = fileName.replace(':', '').replace(/[/\\?%*|"<>]/g, '-');
    } else {
      fileName = fileName.replace(':', '').replace(/\//g, '-').replace(/\\/g, '-');
    }
    return fileName;
  }

  async function fetchAsync(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  }

  if (selection) {
  } else {
  }

  let { title, content, excerpt, byline } = await fetchAsync('https://downmark.herokuapp.com/api/v1?u=' + encodeURIComponent(document.location))
  const fileName = getFileName(title);

  if (vault) {
    var vaultName = '&vault=' + encodeURIComponent(`${vault}`);
  } else {
    var vaultName = '';
  }

  var date = new Date();

  function convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();
    var mmChars = mm.split('');
    var ddChars = dd.split('');
    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
  }

  const today = convertDate(date);

  const fileContent = "---\n"
    + "date: " + today + "\n"
    + "tags: [" + tags + "]\n"
    + "source: " + document.URL + "\n"
    + "author: " + byline + "\n"
    + "---\n\n"
    + content;

  document.location.href = "obsidian://new?"
    + "name=" + encodeURIComponent(folder + fileName)
    + "&content=" + encodeURIComponent(fileContent)
    + vaultName;
})()
