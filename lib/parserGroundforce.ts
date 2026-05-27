import * as XLSX from "xlsx";

import {
  BloqueHorario,
  DiaTurno,
} from "@/types/turnos";

export const CODIGOS = {
  DL: {
    tipo: "Día libre",
    color: "bg-gray-300",
  },

  AJ: {
    tipo: "Ajuste jornada",
    color: "bg-yellow-300",
  },

  F: {
    tipo: "Festivo",
    color: "bg-red-300",
  },

  V: {
    tipo: "Vacaciones",
    color: "bg-green-300",
  },
};

const MESES = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

function extraerBloques(
  texto: string
): BloqueHorario[] {

  const regex =
    /(\d{2}:\d{2})/g;

  const horas =
    texto.match(regex) || [];

  const bloques: BloqueHorario[] =
    [];

  for (
    let i = 0;
    i < horas.length;
    i += 2
  ) {
    const inicio =
      horas[i];

    const fin =
      horas[i + 1];

    if (
      inicio &&
      fin
    ) {
      bloques.push({
        inicio,
        fin,
      });
    }
  }

  return bloques;
}

export async function importarExcelGroundforce(
  file: File
): Promise<DiaTurno[]> {

  const data =
    await file.arrayBuffer();

  const workbook =
    XLSX.read(data);

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const json =
    XLSX.utils.sheet_to_json(
      sheet,
      {
        header: 1,
      }
    ) as any[][];

  const turnos: DiaTurno[] =
    [];

  let mesActual =
    "SIN MES";

  for (
    let fila = 0;
    fila < json.length;
    fila++
  ) {

    const row =
      json[fila];

    if (!row) continue;

    // DETECTAR MES
    const textoFila =
      row.join(" ")
        .toUpperCase();

    for (
      const mes of MESES
    ) {
      if (
        textoFila.includes(
          mes
        )
      ) {
        mesActual = mes;
      }
    }

    // LEER DIAS
    for (
      let col = 1;
      col <= 31;
      col++
    ) {

      const valor =
        row[col];

      if (!valor)
        continue;

      const texto =
        String(valor)
          .trim();

      if (
        texto === ""
      )
        continue;

      // CODIGOS
      if (
        CODIGOS[
          texto as keyof typeof CODIGOS
        ]
      ) {

        turnos.push({
          mes: mesActual,
          dia: col,
          codigo: texto,
          bloques: [],
        });

        continue;
      }

      // HORARIOS
      const bloques =
        extraerBloques(
          texto
        );

      if (
        bloques.length > 0
      ) {

        turnos.push({
          mes: mesActual,
          dia: col,
          bloques,
        });

      }
    }
  }

  return turnos;
}