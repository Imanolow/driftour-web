// Configuración de Stripe
const stripe = Stripe('pk_test_your_publishable_key_here'); // Reemplazar con tu clave pública

// Crear elementos de Stripe
let elements;
let cardElement;

// Funciones de pago
export const payments = {
  // Inicializar Stripe Elements
  initStripeElements() {
    elements = stripe.elements();
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    });
  },

  // Crear suscripción premium
  async createPremiumSubscription(userEmail) {
    try {
      // Llamar a tu backend para crear la suscripción
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          priceId: 'price_premium_monthly' // ID del precio en Stripe
        }),
      });

      const { clientSecret, customerId } = await response.json();

      // Confirmar el pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: userEmail,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return { success: true, subscription: result.paymentIntent };
    } catch (error) {
      console.error('Error al crear suscripción:', error);
      return { success: false, error: error.message };
    }
  },

  // Procesar pago de tour individual
  async processTourPayment(tourId, amount, userEmail) {
    try {
      // Crear Payment Intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convertir a centavos
          currency: 'eur',
          tourId: tourId,
          customerEmail: userEmail
        }),
      });

      const { clientSecret } = await response.json();

      // Confirmar el pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: userEmail,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return { success: true, payment: result.paymentIntent };
    } catch (error) {
      console.error('Error al procesar pago:', error);
      return { success: false, error: error.message };
    }
  },

  // Cancelar suscripción
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionId
        }),
      });

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      return { success: false, error: error.message };
    }
  }
};

// Funciones auxiliares para la UI
export const paymentUI = {
  // Mostrar modal de pago premium
  showPremiumPaymentModal() {
    // Crear modal de pago
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
      <div class="payment-modal-content">
        <div class="payment-header">
          <h3>🌟 Suscripción Premium</h3>
          <button class="close-payment-btn" onclick="this.closest('.payment-modal').remove()">×</button>
        </div>
        <div class="payment-body">
          <div class="payment-details">
            <h4>Plan Premium - 4.99€/mes</h4>
            <ul>
              <li>✅ Tours ilimitados</li>
              <li>✅ Acceso a tours exclusivos</li>
              <li>✅ Mapas offline</li>
              <li>✅ Audio de alta calidad</li>
              <li>✅ Soporte prioritario</li>
            </ul>
          </div>
          <div class="payment-form">
            <div id="card-element">
              <!-- Stripe Elements se insertará aquí -->
            </div>
            <div id="card-errors" role="alert"></div>
          </div>
          <button id="submit-payment" class="btn btn-premium">
            Suscribirse Ahora
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Inicializar Stripe Elements
    payments.initStripeElements();
    cardElement.mount('#card-element');
    
    // Manejar errores
    cardElement.on('change', ({error}) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });
    
    // Manejar envío del formulario
    document.getElementById('submit-payment').addEventListener('click', async (e) => {
      e.preventDefault();
      
      const user = await auth.getCurrentUser();
      if (!user) {
        showNotification('Debes iniciar sesión para suscribirte', 'error');
        return;
      }
      
      const button = e.target;
      button.disabled = true;
      button.textContent = 'Procesando...';
      
      const result = await payments.createPremiumSubscription(user.email);
      
      if (result.success) {
        showNotification('¡Suscripción activada! Ahora eres Premium', 'success');
        modal.remove();
        
        // Actualizar UI
        document.getElementById('user-type').textContent = '(Premium)';
        document.getElementById('premium-btn').textContent = 'Premium Activo';
        document.getElementById('premium-btn').disabled = true;
      } else {
        showNotification(`Error: ${result.error}`, 'error');
        button.disabled = false;
        button.textContent = 'Suscribirse Ahora';
      }
    });
  },

  // Mostrar modal de pago para tour
  showTourPaymentModal(tourId, tourName, amount) {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
      <div class="payment-modal-content">
        <div class="payment-header">
          <h3>💳 Pago de Tour</h3>
          <button class="close-payment-btn" onclick="this.closest('.payment-modal').remove()">×</button>
        </div>
        <div class="payment-body">
          <div class="payment-details">
            <h4>${tourName}</h4>
            <div class="tour-price">${amount}€</div>
          </div>
          <div class="payment-form">
            <div id="card-element-tour">
              <!-- Stripe Elements se insertará aquí -->
            </div>
            <div id="card-errors-tour" role="alert"></div>
          </div>
          <button id="submit-tour-payment" class="btn btn-premium">
            Pagar ${amount}€
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Inicializar Stripe Elements
    payments.initStripeElements();
    cardElement.mount('#card-element-tour');
    
    // Manejar errores
    cardElement.on('change', ({error}) => {
      const displayError = document.getElementById('card-errors-tour');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });
    
    // Manejar envío del formulario
    document.getElementById('submit-tour-payment').addEventListener('click', async (e) => {
      e.preventDefault();
      
      const user = await auth.getCurrentUser();
      if (!user) {
        showNotification('Debes iniciar sesión para comprar tours', 'error');
        return;
      }
      
      const button = e.target;
      button.disabled = true;
      button.textContent = 'Procesando...';
      
      const result = await payments.processTourPayment(tourId, amount, user.email);
      
      if (result.success) {
        showNotification('¡Pago realizado con éxito! Puedes comenzar el tour', 'success');
        modal.remove();
        
        // Permitir acceso al tour
        document.querySelector(`[data-tour="${tourId}"]`).classList.add('purchased');
      } else {
        showNotification(`Error: ${result.error}`, 'error');
        button.disabled = false;
        button.textContent = `Pagar ${amount}€`;
      }
    });
  }
};
