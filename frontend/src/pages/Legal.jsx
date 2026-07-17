import { Helmet } from 'react-helmet-async';
import PageTransition from '../components/common/PageTransition';

export default function Legal() {
  return (
    <PageTransition>
      <Helmet><title>Mentions Légales — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-3xl">
          <h1 className="font-serif text-3xl text-charbon mb-8">Mentions Légales</h1>

          <div className="bg-white p-8 rounded-sm shadow-card space-y-6 text-sm text-charbon/70 leading-relaxed">
            <div>
              <h2 className="font-serif text-lg text-charbon mb-2">1. Édition du site</h2>
              <p>Le site Ever After Events est édité par :</p>
              <p className="mt-2">Ever After Events SAS<br />25 Rue de la Paix<br />75002 Paris, France</p>
              <p className="mt-2">SIRET : 123 456 789 00012<br />RCS Paris B 123 456 789</p>
              <p className="mt-2">Directrice de la publication : Claire Fontaine</p>
            </div>

            <div>
              <h2 className="font-serif text-lg text-charbon mb-2">2. Hébergement</h2>
              <p>Ce site est hébergé par :</p>
              <p className="mt-2">Vercel Inc.<br />440 N Barranca Ave #4133<br />Covina, CA 91723, États-Unis</p>
            </div>

            <div>
              <h2 className="font-serif text-lg text-charbon mb-2">3. Propriété intellectuelle</h2>
              <p>L'ensemble du contenu du site (textes, images, vidéos, logos) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.</p>
            </div>

            <div>
              <h2 className="font-serif text-lg text-charbon mb-2">4. Protection des données</h2>
              <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à contact@everafterevents.com.</p>
            </div>

            <div>
              <h2 className="font-serif text-lg text-charbon mb-2">5. Cookies</h2>
              <p>Ce site utilise des cookies strictement nécessaires à son fonctionnement. Aucun cookie publicitaire n'est utilisé.</p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
