export type BloqueHorario = {
  inicio: string;
  fin: string;
};

export type DiaTurno = {
  mes: string;
  dia: number;
  codigo?: string;
  bloques: BloqueHorario[];
};

export type CodigoGroundforce = {
  tipo: string;
  color: string;
};