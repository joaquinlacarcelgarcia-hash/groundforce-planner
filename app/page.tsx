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

      console.log(datos);

      setTurnos(datos);

    } catch (error) {
      console.error(error);

      alert(
        "Error importando Excel"
      );
    }
  }

  // =====================================
  // ESTADISTICAS
  // =====================================

  const estadisticas =
    useMemo(() => {

      let horas = 0;

      let nocturnas = 0;

      let festivos = 0;

      let diasTrabajados = 0;

      turnos.forEach((dia) => {

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
      });

      return {
        horas,
        nocturnas,
        festivos,
        diasTrabajados,
      };

    }, [turnos]);

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

        <div className="mb-6 rounded-3xl bg-white p-6 shadow-2xl">

          <h1 className="text-5xl font-black text-blue-700">
            Groundforce Planner
          </h1>

          <p className="mt-2 text-lg text-slate-500">
            Simulador operativo y salarial inteligente
          </p>

        </div>

        {/* IMPORTADOR */}

        <div className="mb-6 rounded-3xl bg-white p-6 shadow-2xl">

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

        {/* CONTENIDO */}

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">

          <Calendario
            turnos={turnos}
          />

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