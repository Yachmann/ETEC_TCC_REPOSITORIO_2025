import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import  supabase  from '../../../supabase'; // ajuste para o caminho do seu client

function CalendarioIndisponiveis({ profissionalId }) {
  const [selectedDays, setSelectedDays] = useState([]);

  // Função para buscar os dias indisponíveis no Supabase
  async function buscarDiasIndisponiveis(profissionalId) {
    const { data, error } = await supabase
      .from('dias_indisponiveis')  // nome da tabela
      .select('data')
      .eq('profissional_id', profissionalId);

    if (error) {
      console.error('Erro ao buscar dias indisponíveis:', error);
      return [];
    }
    return data;
  }

  // Função para adicionar dias indisponíveis no Supabase
  async function adicionarDiasIndisponiveis(profissionalId, dias) {
    // Aqui insere múltiplos dias, cada um como uma linha na tabela
    const records = dias.map(dia => ({
      profissional_id: profissionalId,
      data: dia,
    }));

    const { error } = await supabase.from('dias_indisponiveis').insert(records);

    if (error) {
      console.error('Erro ao adicionar dias indisponíveis:', error);
    }
  }

  useEffect(() => {
    async function carregarDias() {
      const data = await buscarDiasIndisponiveis(profissionalId);
      if (data.length > 0) {
        setSelectedDays(data.map(d => new Date(d.data)));
      }
    }
    carregarDias();
  }, [profissionalId]);

  async function handleSelectDay(day) {
    const jaSelecionado = selectedDays.some(d => d.toDateString() === day.toDateString());

    if (!jaSelecionado) {
      setSelectedDays([...selectedDays, day]);
      await adicionarDiasIndisponiveis(profissionalId, [day.toISOString().split('T')[0]]);
    }
  }

  return (
    <div>
      <h2>Selecione os dias que você estará indisponível</h2>
      <DayPicker
        mode="multiple"
        selected={selectedDays}
        onDayClick={handleSelectDay}
      />
    </div>
  );
}

export default CalendarioIndisponiveis;
