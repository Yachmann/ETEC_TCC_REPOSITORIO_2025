import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();
const app = express();
const stripeKey = process.env.STRIPE_API_KEY;
const stripe = new Stripe(stripeKey); // Substitua pela sua chave secreta do Stripe

const allowedOrigins = [
  'http://localhost:5173',
  'https://contrataioficial.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex: Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `O CORS não permite acesso do origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Endpoint para criar uma sessão de checkout
app.post('/create-checkout-session', async (req, res) => {
  const { priceId, profissionalId } = req.body;

  try {
    // Verifica se já existe uma assinatura ativa para o profissional
    const { data: assinaturaExistente, error: errorAssinatura } = await supabase
      .from('assinaturas')
      .select('status')
      .eq('profissional_id', profissionalId)
      .limit(1); // Limita a consulta a um único resultado

    // Verifica se houve um erro na consulta ao banco
    if (errorAssinatura) {
      console.error('Erro ao verificar assinatura:', errorAssinatura.message);
      return res.status(500).json({ error: `Erro ao verificar assinatura: ${errorAssinatura.message}` });
    }

    // Se não houver assinatura existente (nenhum resultado encontrado), cria a sessão de checkout
    if (assinaturaExistente.length === 0 || assinaturaExistente[0].status !== 'active') {
      // Cria a sessão de checkout no Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId, // O priceId que você envia do frontend
            quantity: 1,
          },
        ],
        mode: 'subscription', // Ou 'payment' dependendo do tipo de plano
        success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/cancel`,
        metadata: {
          profissionalId: profissionalId, // Envia o ID do profissional
        },
      });

      // Retorna o URL da sessão de checkout para o frontend
      return res.json({ url: session.url });
    }

    // Caso exista uma assinatura ativa, retorna um erro
    return res.status(400).json({ error: 'Já existe uma assinatura ativa para este profissional' });

  } catch (error) {
    console.error('Erro ao criar a sessão de checkout:', error.message);
    res.status(500).json({ error: 'Erro ao criar a sessão de checkout' });
  }
});





const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get('/subscription-status/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    const profissionalId = session.metadata.profissionalId;

    console.log(`Profissional ID: ${profissionalId}`);
    console.log(`Status da assinatura: ${subscription.status}`);

    // Atualize ou insira o registro no banco de dados
    const { data, error } = await supabase
      .from('assinaturas')
      .upsert(
        { profissional_id: profissionalId, status: subscription.status },
        { onConflict: 'profissional_id' } // Garante que o conflito será resolvido pela chave única
      );

    if (error) {
      console.error('Erro ao atualizar assinatura no banco de dados:', error.message);
      return res.status(500).json({ error: 'Erro ao atualizar assinatura no banco de dados' });
    }

    res.json({ profissionalId, status: subscription.status });
  } catch (error) {
    console.error('Erro ao verificar status da assinatura:', error.message);
    res.status(500).json({ error: 'Erro ao verificar status da assinatura' });
  }
});
// Inicia o servidor
app.listen(4242, () => console.log('Servidor rodando na porta 4242'));