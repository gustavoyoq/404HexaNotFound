export interface Cliente {
  id_cliente?: number;
  nome?: string;
  sobrenome?: string;
  email?: string;
  telefone_formatado?: string;
  segmento_cliente?: string;
  total_compras?: number;
  total_tickets?: number;
  receita_total_cliente?: number;
  ticket_medio?: number;
  data_ultima_compra?: string;
  data_primeira_compra?: string;
  cidade?: string;
  estado?: string;
  categoria_preferida?: string;
  produto_mais_comprado?: string;
  origem?: string;
}
