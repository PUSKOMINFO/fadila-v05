import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, BookOpen, User, Calendar, Check, BookMarked, Library } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCurrentUser, getBooks, getUserBookBorrows, borrowBook, returnBook, type User as UserType, type Book, type BookBorrow } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TabType = 'katalog' | 'pinjaman';

export default function Perpustakaan() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<(BookBorrow & { book: Book })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('katalog');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadData(currentUser.id);
  }, [navigate]);

  const loadData = (userId: string) => {
    setBooks(getBooks());
    setBorrows(getUserBookBorrows(userId));
  };

  const categories = ['Semua', ...new Set(books.map(b => b.kategori))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.penulis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || book.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBorrow = (book: Book) => {
    if (!user) return;
    
    // Check if already borrowed
    const existingBorrow = borrows.find(b => b.bookId === book.id && b.status === 'dipinjam');
    if (existingBorrow) {
      toast.error('Anda sudah meminjam buku ini');
      return;
    }

    if (book.stok <= 0) {
      toast.error('Stok buku habis');
      return;
    }

    borrowBook(user.id, book.id);
    toast.success('Buku berhasil dipinjam');
    loadData(user.id);
    setSelectedBook(null);
  };

  const handleReturn = (borrowId: string) => {
    if (!user) return;
    returnBook(borrowId);
    toast.success('Buku berhasil dikembalikan');
    loadData(user.id);
  };

  const activeBorrows = borrows.filter(b => b.status === 'dipinjam');
  const historyBorrows = borrows.filter(b => b.status === 'dikembalikan');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-success to-emerald-500 px-4 pt-12 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Perpustakaan</h1>
            <p className="text-sm text-white/80">Pinjam dan kelola buku</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-2xl font-bold">{activeBorrows.length}</p>
            <p className="text-xs text-white/80">Sedang Dipinjam</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-2xl font-bold">{historyBorrows.length}</p>
            <p className="text-xs text-white/80">Total Selesai</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-xl shadow-lg p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab('katalog')}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
              activeTab === 'katalog'
                ? "bg-success text-white"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Library className="w-4 h-4" />
            Katalog
          </button>
          <button
            onClick={() => setActiveTab('pinjaman')}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
              activeTab === 'pinjaman'
                ? "bg-success text-white"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <BookMarked className="w-4 h-4" />
            Pinjaman
          </button>
        </div>
      </div>

      {activeTab === 'katalog' ? (
        <div className="px-4 py-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul atau penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  selectedCategory === cat
                    ? "bg-success text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="bg-card rounded-xl border border-border overflow-hidden text-left hover:shadow-md transition-shadow"
              >
                <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                  {book.cover ? (
                    <img 
                      src={book.cover} 
                      alt={book.judul}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}
                  {book.stok > 0 ? (
                    <span className="absolute top-2 right-2 bg-success text-white text-xs px-2 py-0.5 rounded-full">
                      Stok: {book.stok}
                    </span>
                  ) : (
                    <span className="absolute top-2 right-2 bg-destructive text-white text-xs px-2 py-0.5 rounded-full">
                      Habis
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-foreground text-sm line-clamp-2">{book.judul}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{book.penulis}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4 py-6 space-y-4">
          {/* Active Borrows */}
          {activeBorrows.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Sedang Dipinjam</h3>
              <div className="space-y-3">
                {activeBorrows.map((borrow) => (
                  <div
                    key={borrow.id}
                    className="bg-card rounded-xl border border-border p-4 flex gap-3"
                  >
                    <div className="w-16 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {borrow.book.cover ? (
                        <img src={borrow.book.cover} alt={borrow.book.judul} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm line-clamp-1">{borrow.book.judul}</h4>
                      <p className="text-xs text-muted-foreground">{borrow.book.penulis}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        Dipinjam: {new Date(borrow.tanggalPinjam).toLocaleDateString('id-ID')}
                      </div>
                      <Button
                        onClick={() => handleReturn(borrow.id)}
                        size="sm"
                        className="mt-2 bg-success hover:bg-success/90 text-white h-8"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Kembalikan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {historyBorrows.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Riwayat</h3>
              <div className="space-y-3">
                {historyBorrows.map((borrow) => (
                  <div
                    key={borrow.id}
                    className="bg-card rounded-xl border border-border p-4 flex gap-3 opacity-75"
                  >
                    <div className="w-12 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {borrow.book.cover ? (
                        <img src={borrow.book.cover} alt={borrow.book.judul} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm line-clamp-1">{borrow.book.judul}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(borrow.tanggalPinjam).toLocaleDateString('id-ID')} - {new Date(borrow.tanggalKembali!).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <span className="text-xs text-success font-medium">Selesai</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeBorrows.length === 0 && historyBorrows.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookMarked className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">Belum Ada Pinjaman</p>
              <p className="text-sm text-muted-foreground mt-1">
                Jelajahi katalog untuk meminjam buku
              </p>
            </div>
          )}
        </div>
      )}

      {/* Book Detail Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="mx-4 rounded-2xl max-h-[85vh] overflow-y-auto">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">Detail Buku</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="aspect-[3/4] max-w-[200px] mx-auto rounded-xl bg-muted overflow-hidden mb-4">
                  {selectedBook.cover ? (
                    <img src={selectedBook.cover} alt={selectedBook.judul} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-foreground text-center">{selectedBook.judul}</h3>
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground mt-1">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{selectedBook.penulis}</span>
                </div>

                <div className="flex justify-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                    {selectedBook.kategori}
                  </span>
                  {selectedBook.tahunTerbit && (
                    <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                      {selectedBook.tahunTerbit}
                    </span>
                  )}
                </div>

                {selectedBook.deskripsi && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {selectedBook.deskripsi}
                  </p>
                )}

                <div className="mt-6 p-4 bg-muted rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stok Tersedia</span>
                    <span className={cn(
                      "font-semibold",
                      selectedBook.stok > 0 ? "text-success" : "text-destructive"
                    )}>
                      {selectedBook.stok} buku
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleBorrow(selectedBook)}
                  disabled={selectedBook.stok <= 0}
                  className="w-full mt-4 gradient-success text-white py-5 rounded-xl"
                >
                  {selectedBook.stok > 0 ? 'Pinjam Buku' : 'Stok Habis'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
