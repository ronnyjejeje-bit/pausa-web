package com.pausa.pausa_backend.controller;

import com.pausa.pausa_backend.dto.AlojamientoRequestDto;
import com.pausa.pausa_backend.dto.AlojamientoResponseDto;
import com.pausa.pausa_backend.service.AlojamientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/alojamientos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // Permite la conexión desde Angular
public class AlojamientoController {

    private final AlojamientoService alojamientoService;

    @GetMapping
    public ResponseEntity<List<AlojamientoResponseDto>> listarTodos() {
        return ResponseEntity.ok(alojamientoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlojamientoResponseDto> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alojamientoService.obtenerPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<AlojamientoResponseDto>> buscarPorCiudad(@RequestParam String ciudad) {
        return ResponseEntity.ok(alojamientoService.buscarPorCiudad(ciudad));
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<AlojamientoResponseDto>> filtrar(
            @RequestParam BigDecimal precioMax,
            @RequestParam Integer capacidadMin) {
        return ResponseEntity.ok(alojamientoService.filtrarPorPrecioYCapacidad(precioMax, capacidadMin));
    }

    @PostMapping
    public ResponseEntity<AlojamientoResponseDto> crear(@Valid @RequestBody AlojamientoRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alojamientoService.crear(request));
    }
}