export const maskCPFInput = ({ target }) => {
  const formattedCpf = target.value
    .replace(/[^\d]/g, '')
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  return (target.value = formattedCpf);
}

export const formatCPF = (cpf) => cpf.replace(/[^0-9,]*/g, '').replace(',', '.');
