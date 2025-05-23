<?php
require_once('TCPDF/tcpdf.php');
require 'AccesoBD.php';

$usuario = $_POST['usuario'] ?? '';
$producto = $_POST['producto'] ?? '';
$soloHoy = $_POST['hoy'] ?? false;

$pedidos = obtenerPedidosFiltrados($usuario, $producto, $soloHoy);

// Crear PDF
$pdf = new TCPDF();
$pdf->AddPage();
$pdf->SetFont('helvetica', '', 12);
$pdf->Write(0, "Listado de pedidos", '', 0, 'L', true, 0, false, false, 0);
$pdf->Ln();

foreach ($pedidos as $pedido) {
    $pdf->SetFont('', 'B');
    $pdf->Cell(0, 10, "Pedido #{$pedido['codigo']} - {$pedido['persona']} ({$pedido['fecha']})", 0, 1);
    $pdf->SetFont('', '');
    $pdf->MultiCell(0, 6, "Importe: {$pedido['importe']} € - Estado: {$pedido['estado']} - Dirección: {$pedido['direccion_envio']}", 0, 'L');
    
    $lineas = obtenerLineasPedido($pedido['codigo']);
    foreach ($lineas as $linea) {
        $pdf->MultiCell(0, 6, "   - {$linea['nombre']} x{$linea['cantidad']} @ {$linea['precio']} €", 0, 'L');
    }
    $pdf->Ln(4);
}

$pdf->Output('pedidos.pdf', 'I');
