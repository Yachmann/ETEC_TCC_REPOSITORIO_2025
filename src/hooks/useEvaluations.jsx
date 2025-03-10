import { useState, useEffect } from "react";
import supabase from "../../supabase"; // Adjust the path as needed

const useEvaluations = (profissionalId) => {
  const [evaluations, setEvaluations] = useState([]);
  const [avaliacaoMedia, setAvaliacaoMedia] = useState(0);

  // Function to fetch evaluations from the database
  const fetchEvaluations = async () => {
    console.log("Fetching evaluations for professional ID:", profissionalId);
    const { data, error } = await supabase
      .from("avaliacoes")
      .select("*")
      .eq("profissional_id", profissionalId);
    
    if (error) {
      console.error("Error fetching evaluations:", error);
    } else {
      console.log("Evaluations received from Supabase:", data); // To verify the received data
      setEvaluations(data);
      calcularMedia(data);
    }
  };

  // Function to calculate the average of evaluations
  const calcularMedia = (avaliacoes) => {
    const media = avaliacoes.length > 0
      ? avaliacoes.reduce((soma, item) => soma + item.nota, 0) / avaliacoes.length
      : 0;
    setAvaliacaoMedia(media);
  };

  // Add new evaluation and update the average
  const handleNewEvaluation = async (novaAvaliacao) => {
    const avaliacoesAtualizadas = [...evaluations, novaAvaliacao];
    setEvaluations(avaliacoesAtualizadas);
    calcularMedia(avaliacoesAtualizadas);
  
    // Fetch updated evaluations from the database
    await fetchEvaluations();
  };

  // Fetch evaluations when the component mounts
  useEffect(() => {
    if (profissionalId) {
      fetchEvaluations();
    }
  }, [profissionalId]); // Dependency on the professional ID

  return {
    evaluations,
    avaliacaoMedia,
    handleNewEvaluation,
    fetchEvaluations, // Exposing the function to reload evaluations when needed
  };
};

export default useEvaluations;