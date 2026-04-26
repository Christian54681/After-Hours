import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GlassWater, Music2, MapPin, Sparkles, Calendar, Star } from "lucide-react";
import heroBar from "@/assets/hero-bar.jpg";
import cocktail from "@/assets/cocktail.jpg";
import lounge from "@/assets/lounge.jpg";
import liveMusic from "@/assets/live-music.jpg";
import { useAuth } from "@/context/AuthContext";

const Landing = () => {
  const experiences = [
    {
      img: cocktail,
      icon: GlassWater,
      title: "Mixología de Autor",
      desc: "Cocteles exclusivos creados por nuestros bartenders premiados.",
    },
    {
      img: lounge,
      icon: Sparkles,
      title: "Lounges Privados",
      desc: "Espacios íntimos para celebrar momentos inolvidables.",
    },
    {
      img: liveMusic,
      icon: Music2,
      title: "Música en Vivo",
      desc: "Jazz, soul y DJs internacionales cada fin de semana.",
    },
  ];

  const branches = [
    { name: "Lumière Centro", area: "Polanco", hours: "18:00 - 03:00" },
    { name: "Obsidiana Sur", area: "Roma Norte", hours: "19:00 - 04:00" },
    { name: "Aurora Lounge", area: "Condesa", hours: "20:00 - 03:00" },
  ];

  const { user } = useAuth()

  const handlePrueba = () => {
    console.log("Usuario actual:", user);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border">
        <nav className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <GlassWater className="w-5 h-5 text-primary" />
            <span className="font-display text-xl tracking-wide">Noctura</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#experiencia" className="hover:text-primary transition-colors">Experiencia</a>
            <a href="#sucursales" className="hover:text-primary transition-colors">Sucursales</a>
            <a href="#eventos" className="hover:text-primary transition-colors">Eventos</a>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/registro">Registrarse</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroBar}
          alt="Interior elegante de bar nocturno con iluminación dorada"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="relative container text-center max-w-3xl pt-24 pb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary mb-6">
            <Sparkles className="w-3 h-3" /> Premium Lounge Experience
          </span>
          <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
            Donde la noche <span className="text-gradient-gold">cobra vida</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Una cadena de bares donde la mixología, la música y el ambiente se unen para crear noches que recordarás por siempre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gold-glow">
              <Link to="/registro">Reserva tu lugar</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#sucursales">Ver sucursales</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Experiencia */}
      <section id="experiencia" className="py-24 container">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">La experiencia</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3">Más que un bar</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Cada visita es un viaje sensorial diseñado al detalle.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {experiences.map(({ img, icon: Icon, title, desc }) => (
            <Card key={title} className="glass-card overflow-hidden group border-border hover:border-primary/50 transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={img}
                  alt={title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
              <CardContent className="p-6">
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-display text-2xl mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sucursales */}
      <section id="sucursales" className="py-24 bg-card/30 border-y border-border">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Encuéntranos</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3">Nuestras sucursales</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {branches.map((b) => (
              <Card key={b.name} className="glass-card hover:gold-glow transition-all">
                <CardContent className="p-8">
                  <MapPin className="w-5 h-5 text-primary mb-4" />
                  <h3 className="font-display text-2xl mb-1">{b.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{b.area}</p>
                  <div className="flex items-center gap-2 text-sm text-foreground/80 pt-4 border-t border-border">
                    <Calendar className="w-4 h-4 text-primary" />
                    {b.hours}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eventos / CTA */}
      <section id="eventos" className="py-24 container">
        <Card className="glass-card overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-10 md:p-16">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Miembros Noctura</span>
              <h2 className="font-display text-4xl md:text-5xl mt-3 mb-6">
                Acceso exclusivo <span className="text-gradient-gold">a la noche</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Regístrate y obtén reservaciones prioritarias, eventos privados y promociones únicas para socios.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="gold-glow">
                  <Link to="/registro">Únete ahora</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Ya soy miembro</Link>
                </Button>
              </div>
              <div className="flex items-center gap-1 mt-8 text-sm text-muted-foreground">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="ml-2">Más de 10,000 miembros activos</span>
              </div>
            </div>
            <div className="relative h-64 md:h-full min-h-[320px]">
              <img
                src={liveMusic}
                alt="Concierto en vivo en bar premium"
                loading="lazy"
                width={800}
                height={800}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent" />
            </div>
          </div>
        </Card>
      </section>

      {/* Sección de prubas para modelos */}
      <section className="py-24 container">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Pruebas de modelos</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardContent>
              <h3 className="font-display text-2xl mb-2">
                {user
                  ? `Bienvenido, ${user.username || user.nombre || 'Usuario'}`
                  : "No hay usuario autenticado"
                }
                {user ? `Bienvenido, ${user.username}` : "No hay usuario autenticado"}
              </h3>
              <button onClick={handlePrueba}>Probar Modelo</button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GlassWater className="w-4 h-4 text-primary" />
            <span className="font-display text-lg text-foreground">Noctura</span>
          </div>
          <p>© {new Date().getFullYear()} Noctura. Bebe con responsabilidad.</p>
          <Link to="/admin" className="hover:text-primary transition-colors">
            Acceso administrativo
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
