export interface MathReference {
  id: string;
  bookIndex: string;
  teacherIndex: string;
  title: string;
  type: 'theorem' | 'definition' | 'proposition' | 'example' | 'other';
  imageUrl?: string;
  description?: string;
  dateAdded: Date;
}

export type SortField = 'bookIndex' | 'teacherIndex' | 'dateAdded';
export type SortDirection = 'asc' | 'desc';