export class CommunityPost {
  constructor(id, author, content, timestamp, likes = 0, replies = []) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.timestamp = timestamp;
    this.likes = likes;
    this.replies = replies;
  }
} 