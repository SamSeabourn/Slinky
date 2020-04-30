class Bookmark {
  constructor(url, favicon = "icons/icon48", title, tags = [], clicks = 0, isDeleted = false, id = null, isInSearch = true) {
    this.bId = id //ID is nullable because it is set automatical in the DB but is the added to the object for the view
    this.title = title;
    this.url = url;
    this.favicon = favicon;
    this.tags = tags;
    this.clicks = clicks;
    this.isInSearch = isInSearch;
    this.isDeleted = isDeleted;
  }
}

class User {
  constructor(uId, refreshToken, isAnonymous) {
    this.uId = uId;
    this.refreshToken = refreshToken;
    this.isAnonymous = isAnonymous;
  }
}
