import { DiaTurno } from "@/types/turnos";

function esDescanso(
  dia: DiaTurno
) {

  return (
    dia.codigo === "DL" ||
    dia.codigo === "D"
  );
}

export function detectarRotacion(
  turnos: DiaTurno[]
) {

  const ordenados =
    [...turnos].sort(
      (a, b) =>
        a.dia - b.dia
    );

  let descansos2 = 0;
  let descansos5 = 0;

  for (
    let i = 0;
    i < ordenados.length;
    i++
  ) {

    const actual =
      ordenados[i];

    const siguiente =
      ordenados[i + 1];

    // DOS DESCANSOS

    if (
      actual &&
      siguiente &&
      esDescanso(actual) &&
      esDescanso(siguiente)
    ) {

      descansos2++;

    }

    // CINCO DESCANSOS

    if (
      i + 4 <
      ordenados.length
    ) {

      const bloque =
        ordenados.slice(
          i,
          i + 5
        );

      const todosDescanso =
        bloque.every(
          esDescanso
        );

      if (
        todosDescanso
      ) {

        descansos5++;

      }
    }
  }

  // PATRON GROUNDFORCE

  if (
    descansos2 > 0 &&
    descansos5 > 0
  ) {

    return "ROTACION GROUNDFORCE";

  }

  return "Analizando patrón";
}