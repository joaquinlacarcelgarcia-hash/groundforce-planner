import {
  CONVENIO,
} from "./configConvenio";

type Props = {
  horas: number;
  nocturnas: number;
  festivos: number;
  diasTrabajados: number;
  categoria?:
  | "agenteRampa"
  | "supervisorRampa"
  | "jefeServicio"
  | "agenteJefe"
  | "supervisorNucleo";
};

export function calcularNomina({
  horas,
  nocturnas,
  festivos,
  diasTrabajados,
  categoria,
}: Props) {
  const categoriaSeleccionada =
  categoria =
  "agenteRampa";
const convenioCategoria =
  CONVENIO.categorias[
    categoriaSeleccionada
  ];

  const salarioBase =
    convenioCategoria.salarioBase

  const plusNocturnidad =
    nocturnas *
    convenioCategoria.plusHoraNocturna

  const plusFestivos =
    festivos *
    CONVENIO.plusFestivo;

  const plusTransporte =
    diasTrabajados *
    CONVENIO.plusTransporte;

  const bruto =
    salarioBase +
    plusNocturnidad +
    plusFestivos +
    plusTransporte;

  const irpf =
    bruto *
    CONVENIO.irpf;

  const neto =
    bruto - irpf;

  return {
    salarioBase,
    plusNocturnidad,
    plusFestivos,
    plusTransporte,
    bruto,
    irpf,
    neto,
  };
}