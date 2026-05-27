"use client";

import { useMemo, useState } from "react";

import {
  importarExcelGroundforce,
} from "@/lib/parserGroundforce";

import {
  DiaTurno,
} from "@/types/turnos";

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
  let horas = 0;

  let actual = Number(
    inicio.split(":")[0]
  );

  const final = Number(
    fin.split(":")[0]
  );

  while (actual !== final) {

    if (
      actual >= 22 ||
      actual < 6
    ) {
      horas++;
    }

    actual =
      (actual + 1) % 24;
  }

  return horas;
}

function calcularHorasDia(
  dia: DiaTurno
) {
  let total = 0;

  dia.bloques.forEach(
    (bloque) => {

      total +=
        calcularHoras(
          bloque.inicio,
          bloque.fin
        );

    }
  );

  return total;
}

function obtenerColorTurno(
  dia: DiaTurno
) {

  if (
    dia.codigo === "DL"
  ) {
    return "bg-slate-200 border-slate-300";
  }

  if (
    dia.codigo === "V"
  ) {
    return "bg-green-100 border-green-300";
  }

  if (
    dia.codigo === "F"
  ) {
    return "bg-red-100 border-red-300";
  }

  if (
    dia.bloques.some(
      (b) =>
        Number(
          b.inicio.split(":")[0]
        ) >= 22
    )
  ) {
    return "bg-purple-100 border-purple-300";
  }

  if (
    dia.bloques.some(
      (b) =>
        Number(
          b.inicio.split(":")[0]
        ) < 12
    )
  ) {
    return "bg-blue-100 border-blue-300";
  }

  return "bg-orange-100 border-orange-300";
}

function obtenerNombreDia(
  indice: number
) {

  const dias = [
    "LUN",
    "MAR",
    "MIE",
    "JUE",
    "VIE",
    "SAB",
    "DOM",
  ];

  return dias[indice];
}

export default function Home() {

  const [turnos, setTurnos] =
    useState<DiaTurno[]>([]);

  const [mesActivo, setMesActivo] =
    useState("TODOS");

  // =====================================
  // IMPORTAR
  // =====================================

  async function manejarImportacion(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    try {

      const file =
        e.target.files?.[0];

      if (!file) return;

      const datos =
        await importarExcelGroundforce(
          file
        );

      setTurnos(datos);

    } catch (error) {

      console.error(error);

      alert(
        "Error importando Excel"
      );
    }
  }

  // =====================================
  // MESES
  // =====================================

  const meses =
    Array.from(
      new Set(
        turnos.map(
          (t) => t.mes
        )
      )
    );

  // =====================================
  // FILTRO
  // =====================================

  const turnosFiltrados =
    mesActivo === "TODOS"
      ? turnos
      : turnos.filter(
          (t) =>
            t.mes ===
            mesActivo
        );

  // =====================================
  // STATS
  // =====================================

  const estadisticas =
    useMemo(() => {

      let horas = 0;

      let nocturnas = 0;

      let festivos = 0;

      let diasTrabajados = 0;

      turnosFiltrados.forEach(
        (dia) => {

          if (
            dia.codigo === "F"
          ) {
            festivos++;
          }

          if (
            dia.bloques.length > 0
          ) {
            diasTrabajados++;
          }

          dia.bloques.forEach(
            (bloque) => {

              horas +=
                calcularHoras(
                  bloque.inicio,
                  bloque.fin
                );

              nocturnas +=
                calcularNocturnas(
                  bloque.inicio,
                  bloque.fin
                );

            }
          );
        }
      );

      return {
        horas,
        nocturnas,
        festivos,
        diasTrabajados,
      };

    }, [turnosFiltrados]);

  // =====================================
  // NOMINA
  // =====================================

  const salarioBase = 1250;

  const plusNocturnidad =
    estadisticas.nocturnas * 3;

  const plusFestivos =
    estadisticas.festivos * 25;

  const plusTransporte =
    estadisticas.diasTrabajados *
    6.66;

  const bruto =
    salarioBase +
    plusNocturnidad +
    plusFestivos +
    plusTransporte;

  const irpf =
    bruto * 0.12;

  const neto =
    bruto - irpf;

  // =====================================
  // OCUPACION
  // =====================================

  const gradoOcupacion =
    Math.min(
      100,
      Math.round(
        (estadisticas.horas /
          160) *
          100
      )
    );

  // =====================================
  // ALERTAS
  // =====================================

  const alertas: string[] =
    [];

  if (
    estadisticas.horas > 180
  ) {
    alertas.push(
      "Exceso posible de jornada"
    );
  }

  if (
    estadisticas.nocturnas > 40
  ) {
    alertas.push(
      "Demasiadas nocturnas"
    );
  }

  // =====================================
  // ORDENAR
  // =====================================

  const diasOrdenados =
    [...turnosFiltrados].sort(
      (a, b) =>
        a.dia - b.dia
    );

  // =====================================
  // UI
  // =====================================

  return (
    <main className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-600 px-6 py-10 shadow-2xl">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-5xl font-black tracking-tight text-white">
              Groundforce Planner
            </h1>

            <p className="mt-3 text-lg text-blue-100">
              Centro operativo aeroportuario
            </p>

          </div>

          {/* KPIS */}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

              <div className="text-sm font-bold uppercase tracking-wider text-blue-100">
                Horas
              </div>

              <div className="mt-2 text-4xl font-black text-white">
                {estadisticas.horas}
              </div>

            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

              <div className="text-sm font-bold uppercase tracking-wider text-blue-100">
                Nocturnas
              </div>

              <div className="mt-2 text-4xl font-black text-white">
                {
                  estadisticas.nocturnas
                }
              </div>

            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

              <div className="text-sm font-bold uppercase tracking-wider text-blue-100">
                Ocupación
              </div>

              <div className="mt-2 text-4xl font-black text-white">
                {gradoOcupacion}%
              </div>

            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

              <div className="text-sm font-bold uppercase tracking-wider text-blue-100">
                Neto
              </div>

              <div className="mt-2 text-4xl font-black text-white">
                {neto.toFixed(0)}€
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* BODY */}

      <div className="mx-auto max-w-7xl p-6">

        {/* CONTROLES */}

        <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* IMPORTAR */}

          <div className="rounded-3xl bg-white p-6 shadow-2xl">

            <h2 className="mb-4 text-2xl font-black">
              Importar cuadrante
            </h2>

            <label className="flex cursor-pointer items-center justify-center rounded-3xl bg-blue-600 px-6 py-5 text-xl font-bold text-white transition hover:bg-blue-700">

              Importar Excel Groundforce

              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={
                  manejarImportacion
                }
              />

            </label>

          </div>

          {/* MES */}

          <div className="rounded-3xl bg-white p-6 shadow-2xl">

            <h2 className="mb-4 text-2xl font-black">
              Mes
            </h2>

            <select
              value={mesActivo}
              onChange={(e) =>
                setMesActivo(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-lg font-bold"
            >

              <option value="TODOS">
                TODOS
              </option>

              {meses.map(
                (mes) => (
                  <option
                    key={mes}
                    value={mes}
                  >
                    {mes}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

        {/* LAYOUT */}

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">

          {/* CALENDARIO */}

          <div className="rounded-3xl bg-white p-6 shadow-2xl">

            <div className="mb-8 flex items-center justify-between">

              <div>

                <h2 className="text-3xl font-black text-slate-800">
                  Operativa mensual
                </h2>

                <p className="mt-2 text-slate-500">
                  Calendario operacional aeroportuario
                </p>

              </div>

              <div className="rounded-2xl bg-blue-100 px-5 py-3 font-black text-blue-700">

                {diasOrdenados.length} registros

              </div>

            </div>

            {/* DIAS SEMANA */}

            <div className="mb-4 grid grid-cols-7 gap-3">

              {[
                "LUN",
                "MAR",
                "MIE",
                "JUE",
                "VIE",
                "SAB",
                "DOM",
              ].map((d) => (

                <div
                  key={d}
                  className="rounded-2xl bg-slate-200 py-3 text-center text-sm font-black tracking-wider text-slate-700"
                >
                  {d}
                </div>

              ))}

            </div>

            {/* GRID CALENDARIO */}

            <div className="grid grid-cols-7 gap-3">

              {diasOrdenados.map(
                (
                  dia,
                  index
                ) => {

                  const horasDia =
                    calcularHorasDia(
                      dia
                    );

                  return (

                    <div
                      key={index}
                      className={`min-h-[170px] rounded-3xl border p-3 shadow-sm transition hover:scale-[1.02] hover:shadow-xl ${obtenerColorTurno(
                        dia
                      )}`}
                    >

                      {/* HEADER */}

                      <div className="mb-3 flex items-center justify-between">

                        <div className="text-2xl font-black text-slate-800">
                          {dia.dia}
                        </div>

                        {dia.codigo && (

                          <div className="rounded-xl bg-white px-2 py-1 text-xs font-black shadow">

                            {dia.codigo}

                          </div>

                        )}

                      </div>

                      {/* TURNOS */}

                      <div className="space-y-2">

                        {dia.bloques.length >
                        0 ? (

                          dia.bloques.map(
                            (
                              bloque,
                              i
                            ) => (

                              <div
                                key={i}
                                className="rounded-2xl bg-white p-2 text-center shadow"
                              >

                                <div className="text-sm font-black text-slate-800">

                                  {bloque.inicio}

                                </div>

                                <div className="text-xs text-slate-400">
                                  ↓
                                </div>

                                <div className="text-sm font-black text-slate-800">

                                  {bloque.fin}

                                </div>

                              </div>

                            )
                          )

                        ) : (

                          <div className="rounded-2xl bg-white p-3 text-center text-xs font-bold text-slate-500 shadow">

                            {dia.codigo ||
                              "Sin turno"}

                          </div>

                        )}

                      </div>

                      {/* FOOTER */}

                      {horasDia > 0 && (

                        <div className="mt-3 rounded-2xl bg-white p-2 text-center shadow">

                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Jornada
                          </div>

                          <div className="mt-1 text-lg font-black text-blue-700">

                            {horasDia}h

                          </div>

                        </div>

                      )}

                    </div>

                  );
                }
              )}

            </div>

          </div>

          {/* SIDEBAR */}

          <div className="space-y-6">

            {/* NOMINA */}

            <div className="rounded-3xl bg-white p-6 shadow-2xl">

              <h2 className="mb-6 text-3xl font-black text-slate-800">
                Nómina estimada
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between rounded-2xl bg-slate-100 p-4">

                  <span className="font-semibold">
                    Salario base
                  </span>

                  <span className="font-black">
                    {salarioBase}€
                  </span>

                </div>

                <div className="flex justify-between rounded-2xl bg-slate-100 p-4">

                  <span className="font-semibold">
                    Nocturnidad
                  </span>

                  <span className="font-black">
                    {plusNocturnidad.toFixed(
                      0
                    )}
                    €
                  </span>

                </div>

                <div className="flex justify-between rounded-2xl bg-slate-100 p-4">

                  <span className="font-semibold">
                    Festivos
                  </span>

                  <span className="font-black">
                    {plusFestivos.toFixed(
                      0
                    )}
                    €
                  </span>

                </div>

                <div className="flex justify-between rounded-2xl bg-slate-100 p-4">

                  <span className="font-semibold">
                    Transporte
                  </span>

                  <span className="font-black">
                    {plusTransporte.toFixed(
                      0
                    )}
                    €
                  </span>

                </div>

                <div className="flex justify-between rounded-2xl bg-red-100 p-4">

                  <span className="font-semibold">
                    IRPF
                  </span>

                  <span className="font-black text-red-700">
                    -{irpf.toFixed(0)}€
                  </span>

                </div>

                <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-500 p-6 text-white shadow-xl">

                  <div className="text-sm font-bold uppercase tracking-wider text-blue-100">
                    Neto estimado
                  </div>

                  <div className="mt-2 text-5xl font-black">
                    {neto.toFixed(0)}€
                  </div>

                </div>

              </div>

            </div>

            {/* ALERTAS */}

            <div className="rounded-3xl bg-white p-6 shadow-2xl">

              <h2 className="mb-5 text-3xl font-black text-slate-800">
                Verificador
              </h2>

              {alertas.length ===
              0 ? (

                <div className="rounded-2xl bg-green-100 p-5 text-center font-bold text-green-700">

                  Sin incidencias detectadas

                </div>

              ) : (

                <div className="space-y-3">

                  {alertas.map(
                    (
                      alerta,
                      i
                    ) => (

                      <div
                        key={i}
                        className="rounded-2xl bg-red-100 p-4 font-bold text-red-700"
                      >
                        {alerta}
                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}