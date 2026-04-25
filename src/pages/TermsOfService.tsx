import Layout from '../components/Layout';
import { usePageTitle, PAGE_TITLES } from '../hooks/usePageTitle';

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  usePageTitle(PAGE_TITLES.termsOfService);
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="flex items-center mb-8">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-montserrat">
                  Conditions générales d'utilisation
                </h1>
                <p className="text-gray-600 font-montserrat mt-2">
                  Dernière mise à jour : 1er septembre 2024
                </p>
              </div>
            </div>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">1. Acceptation des conditions</h2>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  En accédant et en utilisant Xaary, vous acceptez d'être lié par ces conditions générales d'utilisation. 
                  Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-montserrat text-sm">
                    💡 <strong>Important :</strong> Ces conditions peuvent être mises à jour. Nous vous informerons 
                    des changements significatifs par e-mail ou via notre plateforme.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">2. Description du service</h2>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Xaary fournit des numéros de téléphone virtuels temporaires permettant de recevoir des codes de vérification SMS.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 font-montserrat mb-2">✅ Services inclus</h3>
                    <ul className="text-green-800 font-montserrat text-sm space-y-1">
                      <li>• Numéros virtuels temporaires</li>
                      <li>• Réception de SMS de vérification</li>
                      <li>• Interface web et mobile</li>
                      <li>• Support client</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 font-montserrat mb-2">❌ Limitations</h3>
                    <ul className="text-red-800 font-montserrat text-sm space-y-1">
                      <li>• Pas d'appels vocaux</li>
                      <li>• Pas d'envoi de SMS</li>
                      <li>• Durée limitée des numéros</li>
                      <li>• Disponibilité selon les pays</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">3. Compte utilisateur</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 font-montserrat mb-2">3.1 Inscription</h3>
                    <p className="text-gray-700 font-montserrat text-sm">
                      Vous devez fournir des informations exactes et maintenir la confidentialité de votre compte.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 font-montserrat mb-2">3.2 Responsabilité</h3>
                    <p className="text-gray-700 font-montserrat text-sm">
                      Vous êtes responsable de toutes les activités sous votre compte et de la sécurité de vos identifiants.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 font-montserrat mb-2">3.3 Suspension</h3>
                    <p className="text-gray-700 font-montserrat text-sm">
                      Nous nous réservons le droit de suspendre ou supprimer des comptes en cas de violation de ces conditions.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">4. Utilisation acceptable</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-red-900 font-montserrat mb-4">🚫 Utilisations interdites</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-red-800 font-montserrat text-sm space-y-2">
                      <li>• Activités illégales ou frauduleuses</li>
                      <li>• Spam ou envoi massif de messages</li>
                      <li>• Violation de la vie privée d'autrui</li>
                      <li>• Contournement de restrictions</li>
                    </ul>
                    <ul className="text-red-800 font-montserrat text-sm space-y-2">
                      <li>• Harcèlement ou menaces</li>
                      <li>• Utilisation automatisée abusive</li>
                      <li>• Revente non autorisée</li>
                      <li>• Atteinte à la sécurité</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">5. Paiements et remboursements</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 font-montserrat mb-2">💳 Paiements</h3>
                    <ul className="text-blue-800 font-montserrat text-sm space-y-1">
                      <li>• Paiement requis avant utilisation</li>
                      <li>• Tarifs affichés en dollars ($)</li>
                      <li>• Paiements sécurisés par SSL</li>
                      <li>• Pas de frais cachés</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-900 font-montserrat mb-2">💰 Politique de remboursement</h3>
                    <div className="text-amber-800 font-montserrat text-sm space-y-2">
                      <p><strong>Remboursement possible dans ces cas :</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Défaillance technique de notre service</li>
                      </ul>
                      <p className="mt-2"><strong>Délai :</strong> 48 heures maximum après l'achat</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">6. Propriété intellectuelle</h2>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800 font-montserrat mb-3">
                    Tous les droits de propriété intellectuelle relatifs à Xaary nous appartiennent.
                  </p>
                  <ul className="text-purple-700 font-montserrat text-sm space-y-1">
                    <li>🔒 Marques déposées et logos</li>
                    <li>💻 Code source et interfaces</li>
                    <li>📄 Contenu et documentation</li>
                    <li>⚙️ Technologies propriétaires</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">7. Limitation de responsabilité</h2>
                <div className="border-l-4 border-gray-400 pl-4">
                  <p className="text-gray-700 font-montserrat text-sm mb-3">
                    Xaary fournit ses services "en l'état". Nous ne garantissons pas :
                  </p>
                  <ul className="text-gray-600 font-montserrat text-sm space-y-1 list-disc list-inside">
                    <li>La disponibilité continue du service</li>
                    <li>La réception de tous les SMS</li>
                    <li>La compatibilité avec tous les services tiers</li>
                    <li>L'absence d'interruptions techniques</li>
                  </ul>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                    <p className="text-yellow-800 font-montserrat text-sm">
                      ⚠️ Notre responsabilité est limitée au montant payé pour le service concerné.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">8. Durée et résiliation</h2>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 font-montserrat">Type de résiliation</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 font-montserrat">Conditions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat font-semibold">Par l'utilisateur</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">À tout moment, depuis les paramètres du compte</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat font-semibold">Par Xaary</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">En cas de violation des conditions</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat font-semibold">Automatique</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">Inactivité de plus de 12 mois</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">9. Droit applicable</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 font-montserrat text-sm">
                    Ces conditions sont régies par le droit ivoirien. Tout litige sera soumis à la juridiction 
                    compétente d'Abidjan, Côte d'Ivoire.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">10. Contact et réclamations</h2>
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-gray-700 font-montserrat mb-4">
                    Pour toute question concernant ces conditions ou pour signaler un problème :
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary font-montserrat">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>support@xaary.com</span>
                    </div>
                  </div>
                  <p className="text-gray-600 font-montserrat text-sm mt-4">
                    📞 Support disponible du lundi au vendredi, 9h-18h (GMT+0)
                  </p>
                </div>
              </section>

              <div className="bg-primary-50 rounded-lg p-6 text-center">
                <p className="text-gray-700 font-montserrat">
                  <strong>Merci d'utiliser Xaary !</strong><br/>
                  En respectant ces conditions, vous contribuez à maintenir un service de qualité pour tous.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}