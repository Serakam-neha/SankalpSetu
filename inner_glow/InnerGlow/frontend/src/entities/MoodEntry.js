import { apiService } from '../services/api';

export class MoodEntry {
  constructor(data) {
    this.id = data._id || data.id;
    this.mood_rating = data.mood_rating;
    this.emotions = data.emotions || [];
    this.activities = data.activities || [];
    this.stress_level = data.stress_level;
    this.notes = data.notes || '';
    this.created_date = data.created_date;
    this.user = data.user;
  }

  static async create(moodData) {
    try {
      const response = await apiService.createMoodEntry(moodData);
      return new MoodEntry(response);
    } catch (error) {
      console.error('Error creating mood entry:', error);
      throw error;
    }
  }

  static async list(sortBy = '-created_date', limit = 30) {
    try {
      const response = await apiService.getMoodEntries();
      return response.moodEntries || [];
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      return [];
    }
  }

  static async getStats() {
    try {
      const response = await apiService.getMoodStats();
      return response;
    } catch (error) {
      console.error('Error fetching mood stats:', error);
      return null;
    }
  }
} 