import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <span className="text-lg font-bold text-title">
              valid<span className="text-secondary">zen</span>.
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              The Meaning Crisis Project
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Nomeie. Entenda. Navegue.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Links</span>
            <Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sobre</Link>
            <Link to="/termos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</Link>
            <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacidade</Link>
            <Link to="/pro" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pro</Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Importante</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Conteúdo educacional. Não substitui avaliação profissional de saúde mental.
            </p>
            <p className="text-xs font-medium text-secondary">
              Em caso de emergência: CVV 188 | SAMU 192
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ValidZen. Todos os direitos reservados.
          </p>
          <span className="text-xs font-medium text-muted-foreground">PT | EN</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
