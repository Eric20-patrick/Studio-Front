import { useEffect, useState } from "react";
import { BlogPost } from "@/types";
import { getBlogPosts } from "@/services/blogService";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Calendar, BookOpen, ArrowRight, Clock, Sparkles } from "lucide-react";
import { assetSrc } from "@/lib/assetSrc";
import serviceHair from "@/assets/service-hair.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = "Blog | Studio Neo";
    setLoading(true);
    getBlogPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // Estima tempo de leitura (200 palavras por minuto)
  const readingTime = (text: string) => {
    const words = text?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  const formatDateShort = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    });

  const formatDateLong = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    });

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://studioneo.com.br/wp-content/uploads/2024/06/Blog-NEO-1.webp"
          alt="Studio Neo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        <div className="relative text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm mb-4">
            <BookOpen size={14} className="text-gold" />
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Dicas & Novidades
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">
            Blog
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
        </div>
      </section>

      {/* LISTA DE POSTS */}
      <section className="section-padding bg-gradient-to-b from-[#faf8f5] to-white relative overflow-hidden">
        {/* Decorações de fundo */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-gold/5 rounded-full -translate-x-36 pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-48 pointer-events-none" />

        <div ref={ref} className="container-salon scroll-reveal relative">
          {/* Subtítulo */}
          <div className="text-center mb-10">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Inspirações, dicas de beleza e tendências para você ficar por dentro
              do mundo dos cuidados pessoais.
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-gold/10 flex flex-col"
                >
                  <div className="aspect-video bg-muted animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-full" />
                    <div className="h-3 bg-muted animate-pulse rounded w-5/6" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black ${loading ? 'hidden' : ''}`}>
            {posts.map((post) => {
              const minutes = readingTime(post.content || post.excerpt || "");
              return (
                <article
                  key={post.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gold/10 hover:border-gold/30 flex flex-col cursor-pointer"
                  onClick={() => setActivePost(post)}
                >
                  {/* Imagem com overlay */}
                  <div className="relative aspect-video overflow-hidden shrink-0">
                    <img
                      src={post.photo ? assetSrc(post.photo) : assetSrc(serviceHair)}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      width={400}
                      height={300}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />

                    {/* Badge data no topo */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-gold-dark shadow-md">
                        <Calendar size={10} />
                        {formatDateShort(post.date)}
                      </span>
                    </div>

                    {/* Tempo de leitura */}
                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-[10px] font-bold text-white shadow-md">
                        <Clock size={10} /> {minutes} min
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 flex flex-col flex-1 relative">
                    {/* Decoração dourada */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -translate-y-12 translate-x-12 group-hover:bg-gold/10 transition-colors duration-500" />

                    <h3
                      className="font-display font-bold text-lg mb-2 text-black break-words relative line-clamp-2"
                      style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                    >
                      {post.title}
                    </h3>

                    {/* Linha decorativa */}
                    <div className="w-10 h-0.5 bg-gradient-to-r from-gold to-transparent mb-3 group-hover:w-16 transition-all duration-300" />

                    <p
                      className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 break-words flex-1"
                      style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                    >
                      {post.excerpt}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePost(post);
                      }}
                      className="text-sm text-gold-dark font-bold inline-flex items-center gap-1 hover:gap-2 hover:text-gold transition-all duration-200 self-start"
                    >
                      Ler mais
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Estado vazio */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-4">
                <BookOpen size={28} className="text-gold-dark" />
              </div>
              <p className="text-muted-foreground">
                Em breve novidades por aqui!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      <Dialog
        open={activePost !== null}
        onOpenChange={(open) => {
          if (!open) setActivePost(null);
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-2xl bg-white border-none p-0 rounded-2xl shadow-2xl overflow-hidden">
          {activePost && (
            <div className="flex flex-col max-h-[85vh]">
              {/* Imagem header */}
              <div className="relative h-48 md:h-64 flex-shrink-0 overflow-hidden">
                <img
                  src={activePost.photo ? assetSrc(activePost.photo) : assetSrc(serviceHair)}
                  alt={activePost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-primary/40" />

                {/* Badge categoria */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-gold-dark uppercase tracking-wider shadow-md">
                    <Sparkles size={10} />
                    Blog
                  </span>
                </div>

                {/* Badge tempo de leitura */}
                <div className="absolute top-4 right-14">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-[10px] font-bold text-white shadow-md">
                    <Clock size={10} />
                    {readingTime(activePost.content || activePost.excerpt || "")} min de leitura
                  </span>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="px-6 md:px-8 pb-6 md:pb-8 pt-5 flex flex-col overflow-hidden">
                <DialogHeader className="text-left space-y-2 block">
                  <DialogTitle
                    className="font-display text-2xl md:text-3xl font-bold text-black tracking-tight pr-6 break-words whitespace-normal"
                    style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                  >
                    {activePost.title}
                  </DialogTitle>

                  {/* Linha decorativa */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent" />

                  <DialogDescription className="text-sm text-muted-foreground text-left pt-1 block">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/10 text-gold-dark font-semibold text-xs">
                      <Calendar size={12} aria-hidden />
                      {formatDateLong(activePost.date)}
                    </span>
                  </DialogDescription>
                </DialogHeader>

                {/* Seção de conteúdo */}
                <div className="mt-5 flex-1 overflow-hidden flex flex-col">
                  <p className="text-xs font-bold text-gold-dark uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-gold" />
                    Artigo
                    <span className="flex-1 h-px bg-gold/20" />
                  </p>
                  <div
                    className="text-[15px] md:text-base text-[#2C2A27] whitespace-pre-line leading-relaxed tracking-wide break-words overflow-y-auto pr-2 flex-1"
                    style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                  >
                    {activePost.content}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
