import api from './api';

export interface Book {
    id: number;
    title: string;
    author: string;
    year?: number;
    description?: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBookData {
    title: string;
    author: string;
    year?: number;
    description?: string;
}

export interface UpdateBookData {
    title?: string;
    author?: string;
    year?: number;
    description?: string;
}

export const booksService = {
    async getAll(search?: string): Promise<Book[]> {
        const params = search ? { search } : {};
        const response = await api.get<Book[]>('/books', { params });
        return response.data;
    },

    async getById(id: number): Promise<Book> {
        const response = await api.get<Book>(`/books/${id}`);
        return response.data;
    },

    async create(data: CreateBookData): Promise<Book> {
        const response = await api.post<Book>('/books/create', data);
        return response.data;
    },

    async update(id: number, data: UpdateBookData): Promise<Book> {
        const response = await api.patch<Book>(`/books/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/books/${id}`);
    },
};
