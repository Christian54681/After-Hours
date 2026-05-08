import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GlassWater, Music2, MapPin, Sparkles, Calendar, Star, Menu } from "lucide-react";
import heroBar from "@/assets/bar.jpg";
import cocktail from "@/assets/cocktail.jpg";
import lounge from "@/assets/lounge.jpg";
import liveMusic from "@/assets/live-music.jpg";
import mojito from "@/assets/mojito.jpg";
import martini from "@/assets/martini.jpg";
import { useRef } from "react";
import cerveza from "@/assets/cerveza.jpg";
import preparados from "@/assets/preparados.jpg";
import licores from "@/assets/licores.jpg";
import ginebra from "@/assets/ginebra.png";
import matusalem from "@/assets/matusalem.png";
import whiski from "@/assets/whiski.jpg";


const Landing = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  const experiences = [
    {
      img: mojito,
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
      img: whiski,
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
            Experiencia <span className="text-gradient-gold">liquida</span>
          </h1>

        </div>
      </section>


      {/* Seccion de bebidas*/}

      <div className="relative">

        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full"
        >
          ←
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full"
        >
          →
        </button>


        <div
          ref={scrollRef}
          className="w-screen h-screen overflow-x-scroll overflow-y-hidden snap-x snap-mandatory flex scroll-smooth no-scrollbar"
        >

          <section className="w-screen h-screen flex-shrink-0 snap-start flex items-center justify-center px-4">
            <Card className="glass-card overflow-hidden ">
              <div className="grid md:grid-cols-2 items-center max-w-8xl">
                <div className="p-10 md:p-16">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary">Recomendaciones</span>
                  <h2 className="font-display text-4xl md:text-5xl mt-3 mb-6">
                    Martini<span className="text-gradient-gold"> seco </span>
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Precisión, elegancia y carácter en cada sorbo
                  </p>

                  
                </div>
                <div className="relative h-64 md:h-full min-h-[320px]">
                  <img
                    src={martini}
                    alt="Concierto en vivo en bar premium"
                    loading="lazy"
                    width={600}
                    height={600}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-card" />
                </div>
              </div>
            </Card>
          </section>

          <section className="w-screen h-screen flex-shrink-0 snap-start flex items-center justify-center px-4">
            <Card className="glass-card overflow-hidden">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-10 md:p-16">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary">Miembros Noctura</span>
                  <h2 className="font-display text-4xl md:text-5xl mt-3 mb-6">
                    Bebida <span className="text-gradient-gold"> del dia</span>
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    “Servido a las rocas: frío, intenso y sin distracciones.”
                  </p>

                  <div className="flex items-center gap-1 mt-8 text-sm text-muted-foreground">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}

                  </div>
                </div>
                <div className="relative h-64 md:h-full min-h-[320px]">
                  <img
                    src={liveMusic}
                    alt="Concierto en vivo en bar premium"
                    loading="lazy"
                    width={600}
                    height={600}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent" />
                </div>
              </div>
            </Card>
          </section>

        </div>
      </div>

      {/*Cocteleria*/}
      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-8xl">
          <Card className="glass-card overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 items-center">


              <div className="p-8 md:p-10">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold">
                  Carta de Cervezas
                </span>
                <h2 className="font-display text-3xl md:text-4xl mt-3 mb-6">
                  Cervezas<span className="text-gradient-gold"> artesanales</span>
                </h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  La mejor selección de cervezas nacionales e importadas, siempre bien frías
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
                  <div className="space-y-1">
                    {[
                      "Amstel Ultra", "Bohemia Clásica", "Bohemia Cristal", "Bohemia Oscura",
                      "Caguamita Carta Blanca", "Carta Blanca", "Heineken", "Heineken Silver",
                      "Indio 1/2"
                    ].map((cerveza, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {cerveza}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {[
                      "Indio 1/4", "Miller Highlife", "Miller Lite", "Tecate Light",
                      "Tecate Light Lata", "Tecate Roja Lata", "XX Ambar", "XX Lager",
                      "XX Lager Ultra"
                    ].map((cerveza, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {cerveza}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>


              </div>


              <div className="relative h-64 md:h-full min-h-[400px] bg-gradient-to-br from-amber-50 to-amber-100">
                <img
                  src={cerveza}
                  alt="Cerveza artesanal"
                  loading="lazy"
                  width={600}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-amber-900/10" />


              </div>

            </div>
          </Card>
        </div>
      </section>


      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-8xl">
          <Card className="glass-card overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 items-center">


              <div className="p-8 md:p-10">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold">
                  Carta de Preparados
                </span>
                <h2 className="font-display text-3xl md:text-4xl mt-3 mb-6">
                  Bebidas<span className="text-gradient-gold"> preparadas</span>
                </h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  Nuestras mejores combinacines de licores, jugos y sabores únicos para cada ocasión
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
                  <div className="space-y-1">
                    {[
                      "Arrancador",
                      "Bloody Mary",
                      "Bull",
                      "Carajillo",
                      "Cosmopolitan",
                      "Daiquiri",
                      "Margarita",
                      "Margarita Tradicional",
                      "Mojito",
                    ].map((bebida, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {bebida}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {[
                      "Paloma",
                      "Paloma Tradicional",
                      "Piña Colada",
                      "Ruso Blanco",
                      "Ruso Negro",
                      "Sangria",
                      "Vampiro",
                      "Vampiro Tradicional"
                    ].map((cerveza, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {cerveza}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>


              </div>


              <div className="relative h-64 md:h-full min-h-[400px] bg-gradient-to-br from-amber-50 to-amber-100">
                <img
                  src={preparados}
                  alt="Bebidas preparadas"
                  loading="lazy"
                  width={600}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-amber-900/10" />


              </div>

            </div>
          </Card>
        </div>
      </section>


      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-8xl">
          <Card className="glass-card overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 items-center">


              <div className="p-8 md:p-10">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold">
                  Carta de Licores
                </span>
                <h2 className="font-display text-3xl md:text-4xl mt-3 mb-6">
                  Licores<span className="text-gradient-gold"> de casa </span>
                </h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  Los mejores licores nacionales e importados para disfrutar solos o en tus preparados favoritos
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
                  <div className="space-y-1">
                    {[
                      "Azteca De Oro",
                      "Don Pedro",
                      "Presidente",
                      "Torres 5",
                      "Torres 10",
                      "Torres 15",
                      "Torres 20",
                      "Torres 30 ",
                      "Jaime Iro"
                    ].map((bebida, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {bebida}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {[
                      "Courvoisier Vsop",
                      "Hennessy Vsop",
                      "Martell Vsop",
                      "Martell Vsop",
                      "Martell Xo",
                      "Martell Cordon Blue",
                      "Remy Martin Vsop"
                    ].map((cerveza, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {cerveza}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>


              </div>


              <div className="relative h-64 md:h-full min-h-[400px] bg-gradient-to-br from-amber-50 to-amber-100">
                <img
                  src={licores}
                  alt="licores"
                  loading="lazy"
                  width={600}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-amber-900/10" />

              </div>

            </div>
          </Card>
        </div>
      </section>


      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-8xl">
          <Card className="glass-card overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 items-center">


              <div className="p-8 md:p-10">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold">
                  Carta de Licores
                </span>
                <h2 className="font-display text-3xl md:text-4xl mt-3 mb-6">
                  Licores<span className="text-gradient-gold"> de casa </span>
                </h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  Los mejores licores nacionales e importados para disfrutar solos o en tus preparados favoritos
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
                  <div className="space-y-1">
                    {[
                      "Anis Chinchon Campechano",
                      "Anis Chinchon Dulce",
                      "Anis Chinchl Seco",
                      "Amareto Conti",
                      "Amareto Disaronno",
                      "Bayleys",
                      "Crema De Sotol",
                      "Fernet",
                      "Frangelico",
                      "Jager",

                    ].map((bebida, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {bebida}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {[
                      "Hahua",
                      "Licor De Menta",
                      "Licor 43",
                      "Beefeather",
                      "Bombay",
                      "Gibsons",
                      "Hendrichs",
                      "Osó Negro",
                      "Tanqueray"
                    ].map((cerveza, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {cerveza}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>


              </div>


              <div className="relative h-64 md:h-full min-h-[400px] bg-gradient-to-br from-amber-50 to-amber-100">
                <img
                  src={ginebra}
                  alt="ginebra"
                  loading="lazy"
                  width={600}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-amber-900/10" />

              </div>

            </div>
          </Card>
        </div>
      </section>


      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-8xl">
          <Card className="glass-card overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 items-center">


              <div className="p-8 md:p-10">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold">
                  Carta de Licores
                </span>
                <h2 className="font-display text-3xl md:text-4xl mt-3 mb-6">
                  Licores<span className="text-gradient-gold"> de casa </span>
                </h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  Los mejores licores nacionales e importados para disfrutar solos o en tus preparados favoritos
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
                  <div className="space-y-1">
                    {[
                      "400 Conejos Espadin",
                      "400 Conejos Reposado",
                      "400 Conejos Tobala",
                      "Montelobos",
                      "Appleton",
                      "Appleton Blanco",
                      "Appleton State",
                      "Bacardi 8 Anos",
                      "Bacardi Anejo",
                      "Bacardi Blanco",
                      "Bacardi Oakheart",
                      "Bacardi Solera",
                      "Capitan Morgan",
                      "Capitan Morgan Blanco",
                      "Flor De Cana 5 Años",
                      "Havana 3 Años"

                    ].map((bebida, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {bebida}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {[
                      "Havana 5 Años",
                      "Havana 7 Años",
                      "Krahen",
                      "Matusalem Clásico",
                      "Matusalem Platino",
                      "Matusalem Reserva",
                      "Malibu ",
                      "Ron Castillo",
                      "Zacapa 12 Anos",
                      "Zacapa 23 Anos",
                      "Zacapa Xo",
                      "Anejo",
                      "Plata",
                      "Platino",
                      "Reposado",
                      "Rustico"
                    ].map((cerveza, index) => (
                      <div key={index} className="flex items-center gap-2 py-0.5">
                        <span className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                          {cerveza}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>


              </div>


              <div className="relative h-64 md:h-full min-h-[400px] bg-gradient-to-br from-amber-50 to-amber-100">
                <img
                  src={matusalem}
                  alt="matusalem"
                  loading="lazy"
                  width={600}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-amber-900/10" />

              </div>

            </div>
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
