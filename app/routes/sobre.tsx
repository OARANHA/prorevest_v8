import { Link } from "react-router-dom";
import { ArrowRight, Paintbrush, Phone, MapPin } from "lucide-react";

const numbers = [
  { value: "20+", label: "Anos de experiência" },
  { value: "50k+", label: "Projetos realizados" },
  { value: "200+", label: "Cores disponíveis" },
  { value: "98%", label: "Satisfação dos clientes" }
];

const values = [
  { number: "01", title: "Qualidade Premium", description: "Compromisso com a excelência em cada lata que produzimos.", bg: "bg-[#f6d9fb]", ink: "text-[#7b2fc0]" },
  { number: "02", title: "Sustentabilidade", description: "Práticas ecológicas em nossos processos de produção.", bg: "bg-[#def6e7]", ink: "text-[#18865a]" },
  { number: "03", title: "Inovação", description: "Evolução contínua para atender às necessidades do mercado.", bg: "bg-[#daf0fa]", ink: "text-[#156b99]" },
  { number: "04", title: "Paixão", description: "Dedicação refletida em cada produto e projeto.", bg: "bg-[#ffe6c8]", ink: "text-[#b44e14]" }
];

const milestones = [
  { year: "2008", event: "Fundação da Prorevest" },
  { year: "2012", event: "Lançamento da linha premium" },
  { year: "2015", event: "Expansão para 5 estados" },
  { year: "2018", event: "Certificação ambiental ISO 14001" },
  { year: "2020", event: "Inauguração da nova fábrica" },
  { year: "2023", event: "Reconhecimento como marca líder" }
];

export default function AboutUs() {
  return <main className="overflow-hidden bg-[#faf8f5] text-[#27231f]">
    <section aria-labelledby="about-title" className="relative isolate overflow-hidden bg-[#211c19] text-white">
      <img src="/images/factory.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#211c19] via-[#211c19]/85 to-[#211c19]/40" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-32">
        <p className="mb-5 text-xs font-bold uppercase tracking-[.25em] text-orange-300">Nossa essência</p>
        <h1 id="about-title" className="max-w-3xl font-serif text-5xl leading-[1.08] sm:text-6xl lg:text-7xl">
          Mais que tintas.<span className="block text-orange-300"> Histórias que transformam espaços.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/90">Da experiência em obra à criação de cores e revestimentos: conheça a trajetória e os valores da ProRevest.</p>
        <a href="#nossa-historia" className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">Conheça nossa história <ArrowRight size={18}/></a>
      </div>
    </section>

    <section aria-label="ProRevest em números" className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {numbers.map(n => <div key={n.label} className="rounded-2xl bg-gradient-to-br from-[#62385a] to-[#d96337] p-5 text-white shadow-sm sm:p-7">
          <p className="text-4xl font-bold tracking-tight sm:text-5xl">{n.value}</p>
          <p className="mt-2 text-xs leading-snug text-white/90 sm:text-sm">{n.label}</p>
        </div>)}
      </div>
    </section>

    <section id="nossa-historia" className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-20">
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-orange-600">De onde viemos</p>
        <h2 className="font-serif text-4xl sm:text-5xl">Nossa história começa com um sonho e muita dedicação.</h2>
        <p className="mt-7 leading-relaxed text-gray-700">A Prorevest Tintas é a realização do sonho de um menino que foi auxiliar de pedreiro de seu pai e que sempre sonhou em ser dono do seu próprio negócio. Este menino cresceu, correu atrás de seus objetivos e hoje é o empreendedor gaúcho Mateus Dias.</p>
        <p className="mt-4 leading-relaxed text-gray-700">Com foco voltado para a inovação tecnológica e qualidade premium em seus produtos, a Prorevest Tintas oferece uma vasta gama de tintas, resinas, vernizes e revestimentos, diferenciando-se por oferecer personalização de cores em massas, texturas e tintas, incluindo esmaltes, com fabricação própria.</p>
        <p className="mt-4 leading-relaxed text-gray-700">Localizada na região metropolitana de Porto Alegre, a empresa atende engenheiros, arquitetos, empreiteiras, construtoras e consumidores finais de todo o país.</p>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] bg-[#e8dfd5] shadow-xl">
        <img src="/images/factory.png" alt="Fábrica ProRevest" className="aspect-[4/5] h-full w-full object-cover" loading="lazy"/>
        <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/90 p-5 shadow-lg backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Nossa origem</p>
          <p className="mt-1 font-serif text-xl text-[#30231f]">Da obra à inovação em revestimentos.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="values-title" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[.23em] text-orange-600">O que nos move</p>
        <h2 id="values-title" className="mt-3 max-w-2xl font-serif text-4xl sm:text-5xl">Valores que ganham cor, forma e textura.</h2>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(item => <article key={item.number} className={`group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[1.7rem] p-6 transition-transform hover:-translate-y-1 ${item.bg}`}>
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rotate-12 rounded-[35%_65%_45%_55%] border-[17px] border-white/35" />
            <span className={`relative text-5xl font-black tracking-[-.09em] ${item.ink}`}>{item.number}</span>
            <div className="relative"><h3 className="text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-700">{item.description}</p></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.23em] text-orange-600">Nossa trajetória</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Marcos que fazem parte da nossa história.</h2>
          <ol className="mt-8 border-l-2 border-orange-200 pl-6">
            {milestones.map(item => <li key={item.year} className="relative mb-6 last:mb-0">
              <span className="absolute -left-[32px] top-2 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-[#faf8f5]" aria-hidden="true"/>
              <strong className="text-lg text-orange-700">{item.year}</strong>
              <p className="mt-1 text-gray-700">{item.event}</p>
            </li>)}
          </ol>
        </div>
        <div className="space-y-6">
          <article className="rounded-3xl bg-[#eee5f3] p-7 sm:p-9">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7b2fc0]">Nosso fundador</span>
            <h3 className="mt-3 font-serif text-3xl">Mateus Dias</h3>
            <p className="mt-2 leading-relaxed text-gray-700">Empreendedor gaúcho que transformou o sonho de infância em uma empresa referência no mercado de tintas.</p>
          </article>
          <article className="rounded-3xl bg-[#e2f2e8] p-7 sm:p-9">
            <span className="text-xs font-bold uppercase tracking-widest text-[#18865a]">Compromisso ambiental</span>
            <h3 className="mt-3 font-serif text-3xl">Sustentabilidade na prática</h3>
            <p className="mt-3 leading-relaxed text-gray-700">Nossas iniciativas incluem formulações com menor impacto ambiental, embalagens recicláveis e biodegradáveis, eficiência energética e ações de reciclagem e reutilização.</p>
            <Link to="/sustentabilidade" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#166044] underline underline-offset-4">Conheça nossas iniciativas <ArrowRight size={16}/></Link>
          </article>
          <article className="rounded-3xl bg-[#ffe7d2] p-7 sm:p-9">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-700">Tecnologia e criação</span>
            <h3 className="mt-3 font-serif text-3xl">Conheça o Studio ProRevest</h3>
            <p className="mt-3 leading-relaxed text-gray-700">Experimente combinações de cores e texturas em seus ambientes com o Studio ProRevest.</p>
            <Link to="/studio" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-800 underline underline-offset-4">Explorar Studio <ArrowRight size={16}/></Link>
          </article>
        </div>
      </div>
    </section>

    <section className="bg-[#29201e] px-5 py-16 text-center text-white sm:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.23em] text-orange-300">Seu próximo projeto</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Vamos transformar seu espaço?</h2>
        <p className="mx-auto mt-5 max-w-xl text-white/80">Encontre as cores, texturas e soluções que combinam com o seu projeto.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-semibold hover:bg-orange-700"><Paintbrush size={18}/> Explorar produtos</Link>
          <Link to="/contato" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10"><Phone size={18}/> Entrar em contato</Link>
        </div>
      </div>
    </section>
  </main>;
}
