import supabase from "../../../supabase";

const Servico = ({servico,aoAlterarStatus})=> {
    
    const handleStatusChange = async (statusNovo) => {
        const { data, error } = await supabase
          .from('servicos')
          .update({ status: statusNovo })
          .eq('id', servico.id);
    
        if (error) {
          console.error('Error updating service status:', error);
        } else {
          aoAlterarStatus(servico.id, statusNovo);
        }
      };

      const DefinirEstiloFundo = (status) => {
        switch (status) {
          case 'Completo':
            return 'linear-gradient(to right top, #b1ffd3, #91febc, #71fca2, #4df984, #13f662)';
          case 'EmProgresso':
            return 'linear-gradient(to right top, #ffda87, #fec76c, #feb353, #fe9e3c, #ff8629)';
          case 'Pendente':
          default:
            return 'linear-gradient(to right top, #ffb3b3, #ff9999, #ff8080, #ff6666, #ff4d4d)';
        }
      };
    
    return(
        <>
            <li key={servico.id}>
            <p>User ID: {servico.user_id}</p>
              <p>Details: {servico.detalhes}</p>
              <p style={{background: DefinirEstiloFundo(servico.status)}}>Status: {servico.status}</p>
              <button  onClick={() => handleStatusChange('EmProgresso')}>Comecar Servico</button>
              <button onClick={() => handleStatusChange( 'Completo')}>Completar Servico</button>
            </li>
        </>
    )
}
export default Servico