const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 API está rodando! Use /parceiros para acessar os dados.");
});


let parceiros = [];

function isValidPoint(point) {
  return (
    point &&
    point.type === "Point" &&
    Array.isArray(point.coordinates) &&
    point.coordinates.length === 2 &&
    typeof point.coordinates[0] === "number" &&
    typeof point.coordinates[1] === "number"
  );
}

function isValidMultiPolygon(mp) {
  return (
    mp &&
    mp.type === "MultiPolygon" &&
    Array.isArray(mp.coordinates)
  );
}

app.post("/parceiros", (req, res) => {
  const novoParceiro = req.body;

  if (!novoParceiro.id || !novoParceiro.document || !novoParceiro.address || !novoParceiro.coverageArea) {
    return res.status(400).json({ error: "Campos obrigatórios faltando (id, document, address, coverageArea)." });
  }

  if (parceiros.some(p => p.id === novoParceiro.id)) {
    return res.status(400).json({ error: "ID já existe." });
  }
  if (parceiros.some(p => p.document === novoParceiro.document)) {
    return res.status(400).json({ error: "Document já existe." });
  }

  if (!isValidPoint(novoParceiro.address)) {
    return res.status(400).json({ error: "Address deve estar no formato GeoJSON Point." });
  }
  if (!isValidMultiPolygon(novoParceiro.coverageArea)) {
    return res.status(400).json({ error: "CoverageArea deve estar no formato GeoJSON MultiPolygon." });
  }

  parceiros.push(novoParceiro);

  res.status(201).json(novoParceiro);
});

app.get("/parceiros/:id", (req, res) => {
  const parceiro = parceiros.find(p => p.id == req.params.id);
  if (!parceiro) {
    return res.status(404).json({ error: "Parceiro não encontrado." });
  }
  res.json(parceiro);
});

app.get("/parceiros", (req, res) => {
  res.json(parceiros);
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});

const turf = require("@turf/turf");

app.post("/parceiros/search", (req, res) => {
  const { lat, long } = req.body;

  if (lat === undefined || long === undefined) {
    return res.status(400).json({ error: "Informe lat e long no corpo da requisição." });
  }

  const userPoint = turf.point([long, lat]);

  const parceirosCobrindo = parceiros.filter(parceiro => {
    const cobertura = turf.multiPolygon(parceiro.coverageArea.coordinates);
    return turf.booleanPointInPolygon(userPoint, cobertura);
  });

  if (parceirosCobrindo.length === 0) {
    return res.status(404).json({ error: "Nenhum parceiro cobre essa localização." });
  }

  let parceiroMaisProximo = null;
  let menorDistancia = Infinity;

  parceirosCobrindo.forEach(parceiro => {
    const endereco = turf.point(parceiro.address.coordinates);
    const distancia = turf.distance(userPoint, endereco, { units: "kilometers" });

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      parceiroMaisProximo = parceiro;
    }
  });

  res.json(parceiroMaisProximo);
});
