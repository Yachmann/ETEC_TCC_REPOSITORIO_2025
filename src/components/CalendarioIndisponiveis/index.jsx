import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import supabase from '../../../supabase'; // ajuste para o caminho do seu client

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
  async function removerDiaIndisponivel(profissionalId, dia) {
    const { error } = await supabase
      .from('dias_indisponiveis')
      .delete()
      .eq('profissional_id', profissionalId)
      .eq('data', dia);

    if (error) {
      console.error('Erro ao remover dia indisponível:', error);
    }
  }

  useEffect(() => {
    async function carregarDias() {
      const data = await buscarDiasIndisponiveis(profissionalId);
      if (data.length > 0) {
        setSelectedDays(
          data.map(d => {
            const [year, month, day] = d.data.split('-');
            return new Date(year, month - 1, day); // Aqui é local, sem conversão de timezone
          })
        );
        ;
      }
    }
    carregarDias();
  }, [profissionalId]);

  async function handleSelectDay(day) {
    const diaFormatado = day.toISOString().split('T')[0];

    const jaSelecionado = selectedDays.some(
      d => d.toDateString() === day.toDateString()
    );

    if (jaSelecionado) {
      // Remover da UI e do banco
      setSelectedDays(selectedDays.filter(d => d.toDateString() !== day.toDateString()));
      await removerDiaIndisponivel(profissionalId, diaFormatado);
    } else {
      // Adicionar na UI e no banco
      setSelectedDays([...selectedDays, day]);
      await adicionarDiasIndisponiveis(profissionalId, [diaFormatado]);
    }
  }


  return (

    <div >
      <h2>Selecione os dias que você estará indisponível</h2>
      <DayPicker
        mode="multiple"
        selected={selectedDays}
        onDayClick={handleSelectDay}
        modifiers={{
          indisponivel: selectedDays,
        }}
        modifiersStyles={{
          indisponivel: {
            backgroundColor: '#ff4d4d',
            color: 'white',
            fontWeight: 'bold',
          },
        }}
      />


    </div>
  );
}

export default CalendarioIndisponiveis;
