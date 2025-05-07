import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import supabase from '../../../supabase';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Backbutton from '../Backbutton';
import './Calendario.css';

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });

const Calendario = ({ profissional_id }) => {
  const [eventos, setEventos] = useState([]);
  const [novoEvento, setNovoEvento] = useState({ title: '', start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('week');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from('eventos_profissional').select('*').eq('profissional_id', profissional_id);
      if (!error) {
        setEventos(data.map(ev => ({ ...ev, start: new Date(ev.start), end: new Date(ev.end) })));
      }
      setLoading(false);
    })();
  }, [profissional_id]);

  const adicionarEvento = async () => {
    if (!novoEvento.title || !novoEvento.start) return;
    const finalDate = novoEvento.end || novoEvento.start;
    const novo = { profissional_id, title: novoEvento.title, start: new Date(novoEvento.start).toISOString(), end: new Date(finalDate).toISOString() };
    const { error } = await supabase.from('eventos_profissional').insert([novo]);
    if (!error) {
      setEventos([...eventos, { ...novo, start: new Date(novoEvento.start), end: new Date(finalDate) }]);
      setNovoEvento({ title: '', start: '', end: '' });
    }
  };

  const handleSelectEvent = event => {
    alert(`"${event.title}"\nInício: ${event.start.toLocaleString()}\nFim: ${event.end.toLocaleString()}`);
  };

  return (
    <div className="calendar-wrapper">
      <Backbutton rota={`/logged/${profissional_id}`} />
      <h2 className="calendar-title">Calendário de Compromissos</h2>

      <div className="calendar-form">
        <input className="input-field" type="text" placeholder="Título" value={novoEvento.title} onChange={e => setNovoEvento({ ...novoEvento, title: e.target.value })} />
        <input className="input-field" type="datetime-local" value={novoEvento.start} onChange={e => setNovoEvento({ ...novoEvento, start: e.target.value })} />
        <input className="input-field" type="datetime-local" value={novoEvento.end} onChange={e => setNovoEvento({ ...novoEvento, end: e.target.value })} />
        <button className="btn-primary" onClick={adicionarEvento}>Adicionar</button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <Calendar
          className="custom-calendar"
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          onSelectEvent={handleSelectEvent}
          popup
          style={{ height: '600px' }}
          messages={{ next: '>', previous: '<', today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', agenda: 'Agenda' }}
        />
      )}
    </div>
  );
};

export default Calendario;
