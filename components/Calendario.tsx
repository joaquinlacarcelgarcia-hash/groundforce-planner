import {
  DiaTurno,
} from "@/types/turnos";

import {
  CODIGOS,
} from "@/lib/parserGroundforce";
function calcularHoras(
  inicio: string,
  fin: string
) {

  const hi = Number(
    inicio.split(":")[0]
  );

  const hf = Number(
    fin.split(":")[0]
  );

  let horas = hf - hi;

  if (horas <= 0) {
    horas += 24;
  }

  return horas;
}

function calcularNocturnas(
  inicio: string,
  fin: string
) {

  let nocturnas = 0;

  let actual = Number(
    inicio.split(":")[0]
  );

  const final = Number(
    fin.split(":")[0]
  );

  let totales = 0;

  while (actual !== final) {

    totales++;

    if (
      actual >= 21 ||
      actual < 8
    ) {
      nocturnas++;
    }

    actual =
      (actual + 1) % 24;
  }

  if (nocturnas >= 4) {
    return totales;
  }

  return nocturnas;
}
type Props = {
  turnos: DiaTurno[];
};

export default function Calendario({
  turnos,
}: Props) {

  // AGRUPAR POR MES
  const agrupados:
    Record<
      string,
      DiaTurno[]
    > = {};

  turnos.forEach((turno) => {

    if (
      !agrupados[
        turno.mes
      ]
    ) {
      agrupados[
        turno.mes
      ] = [];
    }

    agrupados[
      turno.mes
    ].push(turno);

  });

  return (
    <div className="space-y-8">

      {Object.entries(
        agrupados
      ).map(
        ([
          mes,
          dias,
        ]) => (

          <div
            key={mes}
            className="rounded-3xl bg-white p-6 shadow-2xl"
          >

            {/* HEADER MES */}

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-3xl font-black text-blue-700">
                {mes}
              </h2>

              <div className="rounded-2xl bg-blue-100 px-4 py-2 font-bold text-blue-700">
                {dias.length} registros
              </div>

            </div>

            {/* GRID */}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">

              {dias.map(
                (dia, index) => (

                  <div
                    key={`${mes}-${index}`}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >

                    {/* DIA */}

                    <div className="mb-4 flex items-center justify-between">

                      <span className="text-xl font-black">
                        {dia.dia}
                      </span>

                      {dia.codigo && (
                        <span
                          className={`rounded-xl px-3 py-1 text-xs font-bold ${
                            CODIGOS[
                              dia.codigo as keyof typeof CODIGOS
                            ]?.color
                          }`}
                        >
                          {dia.codigo}
                        </span>
                      )}

                    </div>

                    {/* CONTENIDO */}

                    <div className="space-y-2">

                      {dia.bloques.length ===
                      0 ? (

                        <div className="rounded-xl bg-white p-2 text-sm text-slate-500">

                          {dia.codigo
                            ? CODIGOS[
                                dia.codigo as keyof typeof CODIGOS
                              ]?.tipo
                            : "Sin turno"}

                        </div>

                      ) : (

                        dia.bloques.map(
                          (
                            bloque,
                            i
                          ) => (

                            <div
  key={i}
  className="rounded-xl bg-blue-100 p-3"
>

  <div className="text-sm font-black text-slate-800">

    {bloque.inicio} - {bloque.fin}

  </div>

  <div className="mt-2 space-y-1 text-xs font-semibold text-slate-600">

    <div>
      {calcularHoras(
        bloque.inicio,
        bloque.fin
      )}h jornada
    </div>

    <div>
      {calcularNocturnas(
        bloque.inicio,
        bloque.fin
      )}h nocturnas
    </div>

    {calcularNocturnas(
      bloque.inicio,
      bloque.fin
    ) ===
      calcularHoras(
        bloque.inicio,
        bloque.fin
      ) && (

      <div className="font-bold text-indigo-700">
        🌙 convenio nocturno
      </div>

    )}

  </div>

</div>


                          )
                        )

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )
      )}

    </div>
  );
}