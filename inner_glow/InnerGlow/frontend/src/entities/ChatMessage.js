export class ChatMessage {
  constructor(id, content, sender, timestamp, type = "text") {
    this.id = id;
    this.content = content;
    this.sender = sender; // "user" or "ai"
    this.timestamp = timestamp;
    this.type = type;
  }
} 