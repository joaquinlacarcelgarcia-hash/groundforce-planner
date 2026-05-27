"use client";

type Props = {
  onImportar: (
    file: File
  ) => void;
};

export default function ImportadorExcel({
  onImportar,
}: Props) {

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    console.log("INPUT OK");

    const file =
      e.target.files?.[0];

    if (file) {

      console.log(file);

      onImportar(file);
    }
  };

  return (
    <div className="mb-6 rounded-3xl bg-white p-6 shadow-2xl">

      <h2 className="mb-4 text-2xl font-bold">
        Importar cuadrante
      </h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={
          manejarCambio
        }
        className="block w-full rounded-2xl border border-slate-300 p-4"
      />

    </div>
  );
}