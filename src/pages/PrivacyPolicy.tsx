import Layout from '../components/Layout';
import { usePageTitle, PAGE_TITLES } from '../hooks/usePageTitle';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  usePageTitle(PAGE_TITLES.privacyPolicy);
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
                  Politique de confidentialité
                </h1>
                <p className="text-gray-600 font-montserrat mt-2">
                  Dernière mise à jour : 1er septembre 2024
                </p>
              </div>
            </div>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">1. Introduction</h2>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Xaary s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, 
                  utilisons, stockons et protégeons vos informations personnelles lorsque vous utilisez notre service de numéros virtuels temporaires.
                </p>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  En utilisant Xaary, vous acceptez les pratiques décrites dans cette politique.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">2. Informations collectées</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-blue-900 font-montserrat mb-2">2.1 Informations d'inscription</h3>
                  <ul className="text-blue-800 font-montserrat list-disc list-inside space-y-1">
                    <li>Adresse e-mail</li>
                    <li>Mot de passe (chiffré)</li>
                    <li>Date d'inscription</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-green-900 font-montserrat mb-2">2.2 Données d'utilisation</h3>
                  <ul className="text-green-800 font-montserrat list-disc list-inside space-y-1">
                    <li>Numéros virtuels demandés</li>
                    <li>Services utilisés pour la vérification</li>
                    <li>Historique des transactions</li>
                    <li>Adresse IP et données de connexion</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-amber-900 font-montserrat mb-2">2.3 Informations techniques</h3>
                  <ul className="text-amber-800 font-montserrat list-disc list-inside space-y-1">
                    <li>Type de navigateur et version</li>
                    <li>Système d'exploitation</li>
                    <li>Cookies et technologies similaires</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">3. Utilisation des données</h2>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Nous utilisons vos informations pour :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 font-montserrat mb-2">🎯 Services principaux</h3>
                    <ul className="text-gray-700 font-montserrat text-sm space-y-1">
                      <li>• Fournir des numéros virtuels temporaires</li>
                      <li>• Recevoir et transmettre les SMS</li>
                      <li>• Gérer votre compte et historique</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 font-montserrat mb-2">🔧 Amélioration du service</h3>
                    <ul className="text-gray-700 font-montserrat text-sm space-y-1">
                      <li>• Analyser l'utilisation de la plateforme</li>
                      <li>• Détecter et prévenir la fraude</li>
                      <li>• Support technique et client</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">4. Protection des données</h2>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-montserrat">Sécurité renforcée</h3>
                  </div>
                  <ul className="text-gray-700 font-montserrat space-y-2">
                    <li>🔐 <strong>Chiffrement SSL/TLS</strong> pour toutes les communications</li>
                    <li>🏢 <strong>Serveurs sécurisés</strong> avec protection contre les intrusions</li>
                    <li>🕐 <strong>Suppression automatique</strong> des SMS après 24h</li>
                    <li>👥 <strong>Accès limité</strong> aux données par le personnel autorisé uniquement</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">5. Conservation des données</h2>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 font-montserrat">Type de données</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 font-montserrat">Durée de conservation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">SMS reçus</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">24 heures maximum</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">Numéros virtuels utilisés</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">30 jours</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">Données de compte</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">Jusqu'à suppression du compte</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">Logs de connexion</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-montserrat">90 jours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">6. Vos droits</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 font-montserrat mb-2">Droits d'accès</h3>
                    <p className="text-blue-800 font-montserrat text-sm">
                      Vous pouvez demander l'accès à vos données personnelles et recevoir une copie.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 font-montserrat mb-2">Droit de rectification</h3>
                    <p className="text-green-800 font-montserrat text-sm">
                      Vous pouvez corriger ou mettre à jour vos informations personnelles.
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 font-montserrat mb-2">Droit à l'effacement</h3>
                    <p className="text-red-800 font-montserrat text-sm">
                      Vous pouvez demander la suppression de vos données personnelles.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 font-montserrat mb-2">Portabilité des données</h3>
                    <p className="text-purple-800 font-montserrat text-sm">
                      Vous pouvez demander le transfert de vos données dans un format structuré.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">7. Partage des données</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-montserrat font-semibold mb-2">
                    🚫 Xaary ne vend jamais vos données personnelles
                  </p>
                  <p className="text-red-700 font-montserrat text-sm">
                    Nous ne partageons vos informations qu'avec des prestataires de services essentiels 
                    (hébergement, paiement) et uniquement dans le cadre strict de nos services.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">8. Contact</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 font-montserrat mb-4">
                    Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
                  </p>
                  <div className="flex items-center space-x-2 text-primary font-montserrat font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>privacy@taganum.com</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}