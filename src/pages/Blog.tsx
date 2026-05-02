import { useEffect, useState } from "react";
import { BlogPost } from "@/types";
import { getBlogPosts } from "@/services/blogService";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Calendar } from "lucide-react";
import serviceHair from "@/assets/service-hair.jpg";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = "Blog | Studio Neo";
    getBlogPosts().then(setPosts);
  }, []);

  return (
    <div>
      <section className="relative h-[30vh] flex items-center justify-center bg-primary">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">
          Blog
        </h1>
      </section>

      <section className="section-padding">
        <div ref={ref} className="container-salon scroll-reveal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="card-salon group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={serviceHair}
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
                  <button className="text-sm text-gold font-medium hover:underline">
                    Ler mais →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
