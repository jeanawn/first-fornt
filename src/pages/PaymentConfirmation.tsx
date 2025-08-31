import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

interface PaymentConfirmationProps {
  amount: string;
  phoneNumber: string;
  networkName: string;
  onBackToDashboard: () => void;
}

export default function PaymentConfirmation({ 
  amount, 
  phoneNumber, 
  networkName, 
  onBackToDashboard 
}: PaymentConfirmationProps) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onBackToDashboard();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onBackToDashboard]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Animation de succès */}
          <div className="text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Cercles d'animation */}
              <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping"></div>
              <div className="absolute inset-2 rounded-full border-2 border-green-300 animate-ping" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>

          {/* Message principal */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat">
              🎉 Demande de recharge envoyée !
            </h1>
            <p className="text-lg text-gray-600 font-montserrat">
              Votre demande de recharge a été transmise avec succès.
            </p>
          </div>

          {/* Card d'information */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Étapes de confirmation */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-montserrat mb-3">
                  📱 Confirmez sur votre téléphone
                </h3>
                <p className="text-gray-600 font-montserrat">
                  Vous allez recevoir une notification sur votre téléphone mobile pour confirmer le paiement.
                </p>
              </div>

              {/* Détails de la transaction */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-4 text-center">📋 Détails de la recharge</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Montant</span>
                    <span className="font-bold text-blue-900 text-lg">{parseInt(amount).toLocaleString()} crédits</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Téléphone</span>
                    <span className="font-mono text-blue-900">{phoneNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Réseau</span>
                    <span className="font-semibold text-blue-900">{networkName}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">💡 Instructions</h4>
                    <div className="space-y-2 text-sm text-amber-800">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-800 font-bold text-xs">1</span>
                        </div>
                        <p>Vérifiez votre téléphone {phoneNumber}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-800 font-bold text-xs">2</span>
                        </div>
                        <p>Composez le code proposé ou confirmez avec votre PIN</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-800 font-bold text-xs">3</span>
                        </div>
                        <p>Vos crédits seront ajoutés automatiquement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="mt-8 space-y-4">
              <button
                onClick={onBackToDashboard}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                  </svg>
                  <span>Retour au tableau de bord</span>
                </div>
              </button>
              
              {/* Compteur automatique */}
              <div className="text-center">
                <p className="text-gray-500 text-sm font-montserrat">
                  Redirection automatique dans <span className="font-bold text-primary">{countdown}s</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Note de sécurité */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-green-800 text-sm font-medium font-montserrat">
                🔐 Transaction sécurisée par votre opérateur mobile
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}