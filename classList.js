class Bookmark {
    constructor(url, favicon = "icons/icon48", title, tags = [], clicks = 0, isDeleted = false) {
      this.title = title;
      this.url = url;
      this.favicon = favicon;
      this.tags = tags;
      this.clicks = clicks
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
