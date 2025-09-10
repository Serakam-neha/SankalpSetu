export class MeditationSession {
  constructor(id, title, duration, instructor, description, category, featured = false) {
    this.id = id;
    this.title = title;
    this.duration = duration;
    this.instructor = instructor;
    this.description = description;
    this.category = category;
    this.featured = featured;
  }
} 