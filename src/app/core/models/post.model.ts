/**
 * Interface que define la estructura de un Post
 */
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

/**
 * Interface para crear un nuevo Post (sin id)
 */
export interface CreatePost {
  userId: number;
  title: string;
  body: string;
}

/**
 * Interface para actualizar un Post (todos los campos opcionales excepto id)
 */
export interface UpdatePost {
  id: number;
  userId?: number;
  title?: string;
  body?: string;
}