export type CategoryType = 'solar' | 'deepspace' | 'basics' | 'phenomena' | 'exploration';

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface ArticleParameter {
  label: string;
  value: string;
}

export interface Article {
  id: string;
  title: string;
  category: CategoryType;
  summary: string; // 一句话通俗总结
  content: {
    subtitle?: string;
    paragraph: string;
  }[];
  funFact: string; // 趣味冷知识
  misconception: string; // 常见误区纠正
  compareToEarth?: string; // 和地球的区别 / 比例对比
  parameters?: ArticleParameter[]; // 天体大小、自转、温度等数据
  glossary: GlossaryItem[]; // 专业名词点击释义
}

export interface DailyFact {
  id: number;
  title: string;
  fact: string;
  category: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Bookmark {
  articleId: string;
  title: string;
  category: CategoryType;
}

export interface LearningHistory {
  articleId: string;
  title: string;
  category: CategoryType;
  timestamp: number;
}

export interface UserStats {
  completedQuizzesCount: number;
  correctAnswersCount: number;
  readArticlesCount: number;
  savedBookmarksCount: number;
}
