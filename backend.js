import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
const app = express();
const stripeKey = process.env.STRIPE_API_KEY;
const stripe = new Stripe(stripeKey); // Substitua pela sua chave secreta do Stripe

app.use(cors());
app.use(express.json());

// Endpoint para criar uma sessão de checkout
app.post('/create-checkout-session', async (req, res) => {
  const { priceId, profissionalId } = req.body; // Recebe o ID do profissional no corpo da requisição

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId, // ID do preço do plano no Stripe
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
      metadata: {
        profissionalId, // Armazena o ID do profissional para referência
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const supabase = createClient(
  'https://nqtjvyliouaxzuqmfwsr.supabase.co', // Substitua pela URL do seu Supabase
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdGp2eWxpb3VheHp1cW1md3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NzMzNzUsImV4cCI6MjA1NjE0OTM3NX0.uwHHVj2L-UubL2NlOOGqIRsaMhp0JXrx4vveFINIRxc' // Substitua pela sua chave pública do Supabase
);

app.get('/subscription-status/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    console.log(`Recebendo requisição para sessionId: ${sessionId}`);

    // Recupera a sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Sessão recuperada do Stripe:', session);

    // Recupera a assinatura associada à sessão
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    console.log('Assinatura recuperada do Stripe:', subscription);

    // Recupera o ID do profissional armazenado no metadata
    const profissionalId = session.metadata.profissionalId;
    console.log(`Profissional ID recuperado: ${profissionalId}`);

    // Atualize o status da assinatura no banco de dados
    const { data, error } = await supabase
      .from('assinaturas')
      .upsert({ profissional_id: profissionalId, status: subscription.status });

    if (error) {
      console.error('Erro ao atualizar assinatura no banco de dados:', error.message);
      return res.status(500).json({ error: 'Erro ao atualizar assinatura no banco de dados' });
    }

    console.log('Assinatura atualizada no banco de dados:', data);

    // Retorna o status da assinatura
    res.json({ status: subscription.status, profissionalId });
  } catch (error) {
    console.error('Erro ao recuperar status da assinatura:', error.message);
    res.status(500).json({ error: error.message });
  }
});
// Inicia o servidor
app.listen(4242, () => console.log('Servidor rodando na porta 4242'));