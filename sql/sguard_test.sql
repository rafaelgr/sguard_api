SELECT d.descargaId, d.nterminal, d.fecha, d.hora, d.resultado, dl.descargaLineaId, dl.tag, dl.fecha AS lfecha, dl.hora AS lhora, dl.tipo, dl.tipoId
FROM descargas AS d
LEFT JOIN descargas_lineas AS dl ON dl.descargaId = d.descargaId
