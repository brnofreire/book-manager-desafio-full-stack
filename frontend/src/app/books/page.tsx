'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { booksService, Book } from '@/services/books';
import Swal from 'sweetalert2';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

type ViewMode = 'grid' | 'list';

function SortableBook({ book, viewMode, onDelete, deleteId }: {
  book: Book;
  viewMode: ViewMode;
  onDelete: (id: number) => void;
  deleteId: number | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (viewMode === 'list') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all group"
      >
        <div className="flex items-center gap-4 p-4">
          <button
            className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300"
            {...attributes}
            {...listeners}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white truncate">{book.title}</h3>
            <p className="text-sm text-gray-400">por {book.author}</p>
          </div>

          {book.year && (
            <span className="text-sm text-gray-500 hidden sm:block">{book.year}</span>
          )}

          <div className="flex gap-2">
            <Link
              href={`/books/${book.id}/edit`}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={() => onDelete(book.id)}
              disabled={deleteId === book.id}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-all group overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-gray-400">por {book.author}</p>
          </div>
          <button
            className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 p-1"
            {...attributes}
            {...listeners}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>

        {book.year && (
          <p className="text-xs text-gray-500 mb-3">Ano: {book.year}</p>
        )}
        
        {book.description && (
          <p className="text-sm text-gray-400 line-clamp-3 mb-4">
            {book.description}
          </p>
        )}
        
        <div className="flex gap-2 pt-4 border-t border-gray-700">
          <Link
            href={`/books/${book.id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
            Editar
          </Link>
          <button
            onClick={() => onDelete(book.id)}
            disabled={deleteId === book.id}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
            {deleteId === book.id ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 9;
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBooks(1);
    }
  }, [isAuthenticated]);

  const loadBooks = async (pageToLoad: number, searchTerm?: string) => {
    try {
      setIsLoading(true);
      const resp = await booksService.getAll(searchTerm, pageToLoad, limit);
      setBooks(resp.data);
      setTotal(resp.total);
      setPage(resp.page);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadBooks(1, search);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Excluir Livro',
      text: 'Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f3f4f6',
      customClass: {
        popup: 'rounded-xl border border-gray-700',
      }
    });

    if (result.isConfirmed) {
      try {
        setDeleteId(id);
        await booksService.delete(id);
        const newBooks = books.filter((book) => book.id !== id);
        setBooks(newBooks);
        setTotal((t) => Math.max(0, t - 1));

        // If after deletion the current page became empty, try load previous page
        if (newBooks.length === 0 && page > 1) {
          const prev = page - 1;
          setPage(prev);
          await loadBooks(prev, search);
        }
        
        Swal.fire({
          title: 'Excluído!',
          text: 'O livro foi excluído com sucesso.',
          icon: 'success',
          confirmButtonColor: '#8b5cf6',
          background: '#1f2937',
          color: '#f3f4f6',
          customClass: {
            popup: 'rounded-xl border border-gray-700',
          }
        });
      } catch (error) {
        console.error('Erro ao excluir livro:', error);
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível excluir o livro. Tente novamente.',
          icon: 'error',
          confirmButtonColor: '#8b5cf6',
          background: '#1f2937',
          color: '#f3f4f6',
          customClass: {
            popup: 'rounded-xl border border-gray-700',
          }
        });
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBooks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header/Topbar */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Book Manager</h1>
                <p className="text-xs text-gray-400">Sua biblioteca pessoal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden sm:block">
                Olá, <span className="font-medium text-gray-200">{user?.name}</span>
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-400 hover:text-red-300 font-medium transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                  loadBooks(1, '');
                }}
                className="px-4 py-2.5 text-gray-400 hover:text-gray-200 transition"
              >
                Limpar
              </button>
            )}
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex bg-gray-800 border border-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition ${
                  viewMode === 'grid'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition ${
                  viewMode === 'list'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
            <Link
              href="/books/new"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-lg shadow-purple-500/20"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Livro
            </Link>
          </div>
        </div>

        {/* Books Display */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              {search ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
            </h3>
            <p className="text-gray-400 mb-6">
              {search
                ? 'Tente buscar por outro termo'
                : 'Comece adicionando seu primeiro livro'}
            </p>
            {!search && (
              <Link
                href="/books/new"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                Adicionar Livro
              </Link>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={books.map((book) => book.id)}
              strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
            >
              <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-3'}>
                {books.map((book) => (
                  <SortableBook
                    key={book.id}
                    book={book}
                    viewMode={viewMode}
                    onDelete={handleDelete}
                    deleteId={deleteId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        {/* Pagination Controls */}
        {!isLoading && total > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Página {page} de {Math.max(1, Math.ceil(total / limit))} — {total} livros
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (page > 1) {
                    const prev = page - 1;
                    setPage(prev);
                    loadBooks(prev, search);
                  }
                }}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => {
                  if (page * limit < total) {
                    const next = page + 1;
                    setPage(next);
                    loadBooks(next, search);
                  }
                }}
                disabled={page * limit >= total}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
