"use client";

import { useMemo, useState } from "react";

import Calendario from "@/components/Calendario";
import Stats from "@/components/Stats";
import Nomina from "@/components/Nomina";
import Verificador from "@/components/Verificador";

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

export default function Home() {

  const [turnos, setTurnos] =
    useState<DiaTurno[]>([]);

  const [mesActivo, setMesActivo] =
    useState("TODOS");

  // =====================================
  // IMPORTAR EXCEL
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
  // MESES DISPONIBLES
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
  // FILTRAR MES
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
  // ESTADISTICAS
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
            dia.codigo === "DL"
          )
            return;

          if (
            dia.codigo === "V"
          )
            return;

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
  // VERIFICADOR
  // =====================================

  const errores: string[] =
    [];

  if (
    estadisticas.nocturnas > 40
  ) {
    errores.push(
      "Exceso nocturnidad"
    );
  }

  if (
    estadisticas.horas > 180
  ) {
    errores.push(
      "Posible exceso jornada"
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <main className="min-h-screen bg-slate-100 p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-500 p-8 shadow-2xl">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-5xl font-black text-white">
                Groundforce Planner
              </h1>

              <p className="mt-3 text-lg text-blue-100">
                Simulador operativo y salarial inteligente
              </p>

            </div>

            <div className="rounded-3xl bg-white/20 px-6 py-4 backdrop-blur">

              <div className="text-sm font-bold uppercase tracking-widest text-blue-100">
                Grado ocupación
              </div>

              <div className="mt-1 text-4xl font-black text-white">
                {gradoOcupacion}%
              </div>

            </div>

          </div>

        </div>

        {/* CONTROLES */}

        <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_300px]">

          {/* IMPORTAR */}

          <div className="rounded-3xl bg-white p-6 shadow-2xl">

            <h2 className="mb-4 text-2xl font-bold">
              Importar cuadrante
            </h2>

            <label className="flex cursor-pointer items-center justify-center rounded-3xl bg-blue-600 px-6 py-5 text-lg font-bold text-white transition hover:bg-blue-700">

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

          {/* SELECTOR MES */}

          <div className="rounded-3xl bg-white p-6 shadow-2xl">

            <h2 className="mb-4 text-2xl font-bold">
              Mes
            </h2>

            <select
              value={mesActivo}
              onChange={(e) =>
                setMesActivo(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-lg font-semibold"
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

        {/* DASHBOARD SUPERIOR */}

        <div className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-2xl">

            <div className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Horas
            </div>

            <div className="mt-2 text-5xl font-black text-blue-700">
              {estadisticas.horas}
            </div>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-2xl">

            <div className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Nocturnas
            </div>

            <div className="mt-2 text-5xl font-black text-indigo-700">
              {estadisticas.nocturnas}
            </div>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-2xl">

            <div className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Días trabajados
            </div>

            <div className="mt-2 text-5xl font-black text-emerald-700">
              {
                estadisticas.diasTrabajados
              }
            </div>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-2xl">

            <div className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Neto estimado
            </div>

            <div className="mt-2 text-5xl font-black text-orange-600">
              {neto.toFixed(0)}€
            </div>

          </div>

        </div>

        {/* CONTENIDO */}

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">

          {/* CALENDARIO */}

          <Calendario
            turnos={
              turnosFiltrados
            }
          />

          {/* SIDEBAR */}

          <div className="space-y-6">

            <Stats
              horas={
                estadisticas.horas
              }
              nocturnas={
                estadisticas.nocturnas
              }
              dias={
                estadisticas.diasTrabajados
              }
              festivos={
                estadisticas.festivos
              }
              ocupacion={
                gradoOcupacion
              }
            />

            <Nomina
              salarioBase={
                salarioBase
              }
              plusNocturnidad={
                plusNocturnidad
              }
              plusFestivos={
                plusFestivos
              }
              plusTransporte={
                plusTransporte
              }
              irpf={irpf}
              neto={neto}
            />

            <Verificador
              errores={errores}
            />

          </div>

        </div>

      </div>

    </main>
  );
}