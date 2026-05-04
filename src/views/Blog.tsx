import { useEffect, useState } from "react";
import { BlogPost } from "@/types";
import { getBlogPosts } from "@/services/blogService";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Calendar } from "lucide-react";
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
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = "Blog | Studio Neo";
    getBlogPosts().then(setPosts);
  }, []);

  return (
    <div>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://studioneo.com.br/wp-content/uploads/2024/06/Blog-NEO-1.webp"
          alt="Studio Neo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <h1 className="relative text-4xl md:text-5xl font-display font-bold text-primary-foreground justify-center ">
          Blog
        </h1>
      </section>

      <section className="section-padding bg-[#faf8f5]">
        <div ref={ref} className="container-salon scroll-reveal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
            {posts.map((post) => (
              <article
                key={post.id}
                className="card-salon group bg-[#faf8f5] border-none shadow-xl"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={assetSrc(serviceHair)}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    width={400}
                    height={300}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      timeZone: "America/Sao_Paulo",
                    })}
                  </div>
                  <h3 className="font-display font-bold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActivePost(post)}
                    className="text-sm text-gold font-medium hover:underline"
                  >
                    Ler mais →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Dialog
        open={activePost !== null}
        onOpenChange={(open) => {
          if (!open) setActivePost(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto sm:rounded-lg">
          {activePost && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display pr-8 ">
                  {activePost.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground text-left pt-1 ">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} aria-hidden />
                    {new Date(activePost.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      timeZone: "America/Sao_Paulo",
                    })}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="text-sm text-foreground whitespace-pre-line leading-relaxed pt-2">
                {activePost.content}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
